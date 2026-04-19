import {
	ConflictException,
	Injectable,
	NotFoundException,
	BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Center } from "src/centers/entities/center.entity";
import { CreateCenterDto } from "src/centers/dto/create-center.dto";
import { UpdateCenterDto } from "src/centers/dto/update-center.dto";
import { User } from "src/users/entities/user.entity";
import { CenterType } from "src/centers/enums/center-type.enum";

@Injectable()
export class CentersService {
	constructor(
		@InjectRepository(Center)
		private readonly centersRepo: Repository<Center>,
		@InjectRepository(User)
		private readonly usersRepo: Repository<User>,
	) {}

	private stripPasswordsFromUsers(center: Center): void {
		if (!center.users?.length) return;
		for (const u of center.users) {
			delete (u as { password?: string }).password;
		}
	}

	private stripManagerPassword(center: Center): void {
		if (center.manager) {
			delete (center.manager as { password?: string }).password;
		}
	}

	async findAll(filters: {
		centerType?: CenterType;
		active?: boolean;
	}): Promise<Center[]> {
		const qb = this.centersRepo
			.createQueryBuilder("c")
			.leftJoinAndSelect("c.manager", "manager")
			.leftJoinAndSelect("c.parentCenter", "parent")
			.leftJoinAndSelect("c.branches", "branches")
			.leftJoinAndSelect("c.vehicles", "vehicles")
			.orderBy("c.centerType", "ASC")
			.addOrderBy("c.name", "ASC");

		if (filters.centerType) {
			qb.andWhere("c.centerType = :centerType", {
				centerType: filters.centerType,
			});
		}
		if (filters.active !== undefined) {
			qb.andWhere("c.active = :active", { active: filters.active });
		}

		const rows = await qb.getMany();
		for (const c of rows) {
			this.stripManagerPassword(c);
		}
		return rows;
	}

	async findOne(id: number): Promise<Center> {
		const center = await this.centersRepo.findOne({
			where: { id },
			relations: {
				manager: true,
				parentCenter: true,
				branches: true,
				vehicles: true,
				users: true,
			},
		});
		if (!center) {
			throw new NotFoundException("Center not found");
		}
		this.stripManagerPassword(center);
		this.stripPasswordsFromUsers(center);
		return center;
	}

	async create(dto: CreateCenterDto): Promise<Center> {
		const dup = await this.centersRepo.findOne({
			where: { code: dto.code },
		});
		if (dup) {
			throw new ConflictException("Center code already exists");
		}
		if (dto.managerId) {
			const mgr = await this.usersRepo.findOne({
				where: { id: dto.managerId },
			});
			if (!mgr) {
				throw new BadRequestException("Manager user not found");
			}
		}
		if (dto.parentCenterId != null) {
			const parent = await this.centersRepo.findOne({
				where: { id: dto.parentCenterId },
			});
			if (!parent) {
				throw new BadRequestException("Parent center not found");
			}
		}

		const center = this.centersRepo.create({
			name: dto.name,
			code: dto.code,
			centerType: dto.centerType ?? CenterType.BRANCH,
			isIndependent: dto.isIndependent ?? false,
			address: dto.address ?? null,
			managerId: dto.managerId ?? null,
			parentCenterId: dto.parentCenterId ?? null,
			active: true,
		});
		return this.centersRepo.save(center);
	}

	async update(id: number, dto: UpdateCenterDto): Promise<Center> {
		const center = await this.centersRepo.findOne({ where: { id } });
		if (!center) {
			throw new NotFoundException("Center not found");
		}
		if (dto.code && dto.code !== center.code) {
			const dup = await this.centersRepo.findOne({
				where: { code: dto.code },
			});
			if (dup) {
				throw new ConflictException("Center code already exists");
			}
		}
		if (dto.managerId) {
			const mgr = await this.usersRepo.findOne({
				where: { id: dto.managerId },
			});
			if (!mgr) {
				throw new BadRequestException("Manager user not found");
			}
		}
		if (dto.parentCenterId !== undefined && dto.parentCenterId !== null) {
			if (dto.parentCenterId === id) {
				throw new BadRequestException("Center cannot be its own parent");
			}
			const parent = await this.centersRepo.findOne({
				where: { id: dto.parentCenterId },
			});
			if (!parent) {
				throw new BadRequestException("Parent center not found");
			}
		}

		Object.assign(center, {
			...(dto.name !== undefined && { name: dto.name }),
			...(dto.code !== undefined && { code: dto.code }),
			...(dto.centerType !== undefined && { centerType: dto.centerType }),
			...(dto.isIndependent !== undefined && {
				isIndependent: dto.isIndependent,
			}),
			...(dto.address !== undefined && { address: dto.address }),
			...(dto.managerId !== undefined && { managerId: dto.managerId }),
			...(dto.parentCenterId !== undefined && {
				parentCenterId: dto.parentCenterId,
			}),
			...(dto.active !== undefined && { active: dto.active }),
		});

		return this.centersRepo.save(center);
	}
}
