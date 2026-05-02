import {
	ConflictException,
	Injectable,
	NotFoundException,
	BadRequestException,
	UnauthorizedException,
	ForbiddenException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Center } from "src/centers/entities/center.entity";
import { SubCenterRequest } from "src/centers/entities/sub-center-request.entity";
import { CreateCenterDto } from "src/centers/dto/create-center.dto";
import { UpdateCenterDto } from "src/centers/dto/update-center.dto";
import { CreateSubCenterRequestDto } from "src/centers/dto/create-sub-center-request.dto";
import { User } from "src/users/entities/user.entity";
import { CenterType } from "src/centers/enums/center-type.enum";
import { SubCenterRequestStatus } from "src/centers/enums/sub-center-request-status.enum";
import { UserRole } from "src/users/enums/user-role.enum";

@Injectable()
export class CentersService {
	constructor(
		@InjectRepository(Center)
		private readonly centersRepo: Repository<Center>,
		@InjectRepository(SubCenterRequest)
		private readonly subCenterRequestsRepo: Repository<SubCenterRequest>,
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

	async createSubCenterRequest(
		userId: string,
		dto: CreateSubCenterRequestDto,
	): Promise<SubCenterRequest> {
		const user = await this.usersRepo.findOne({ where: { id: userId } });
		if (!user) {
			throw new UnauthorizedException("User not found");
		}
		const row = this.subCenterRequestsRepo.create({
			requestedName: dto.centerName.trim(),
			location: dto.location?.trim() || null,
			notes: dto.notes?.trim() || null,
			requestedByUserId: userId,
			requestedFromCenterId: user.centerId ?? null,
			status: SubCenterRequestStatus.PENDING,
		});
		return this.subCenterRequestsRepo.save(row);
	}

	/** Auto-generates a unique code ≤20 chars; parent is the user's center when set. */
	private async allocateUniqueBranchCode(nameSeed: string): Promise<string> {
		const slug = nameSeed
			.replace(/[^a-zA-Z0-9]/g, "")
			.toUpperCase()
			.slice(0, 6);
		const prefix = (slug.length ? slug : "BR").slice(0, 6);
		for (let attempt = 0; attempt < 40; attempt++) {
			const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
			const ts = Date.now().toString(36).toUpperCase().slice(-3);
			const candidate = `${prefix}-${ts}${rand}`.slice(0, 20);
			const exists = await this.centersRepo.exist({
				where: { code: candidate },
			});
			if (!exists) return candidate;
		}
		throw new ConflictException("Could not allocate a unique center code");
	}

	/**
	 * Create a branch center from the admin modal (name + optional location/notes).
	 * Managers: parent = their assigned center. Admins: parent = their center if any, else root branch.
	 */
	async createQuickBranch(
		userId: string,
		dto: CreateSubCenterRequestDto,
	): Promise<Center> {
		const user = await this.usersRepo.findOne({ where: { id: userId } });
		if (!user) {
			throw new UnauthorizedException("User not found");
		}
		if (user.role === UserRole.MANAGER) {
			if (user.centerId == null) {
				throw new BadRequestException(
					"Manager must be assigned to a center to add a branch",
				);
			}
		} else if (
			user.role !== UserRole.ADMIN &&
			user.role !== UserRole.SUPER_ADMIN
		) {
			throw new ForbiddenException("Not allowed to create a branch");
		}

		const name = dto.centerName.trim();
		if (!name.length) {
			throw new BadRequestException("Center name is required");
		}

		let parentCenterId: number | null = null;
		if (user.role === UserRole.MANAGER) {
			parentCenterId = user.centerId!;
		} else {
			parentCenterId = user.centerId ?? null;
		}

		const addressParts = [dto.location?.trim(), dto.notes?.trim()].filter(
			(s): s is string => !!s && s.length > 0,
		);
		const address = addressParts.length ? addressParts.join("\n\n") : null;

		const code = await this.allocateUniqueBranchCode(name);

		return this.create({
			name,
			code,
			centerType: CenterType.BRANCH,
			isIndependent: false,
			address: address ?? undefined,
			parentCenterId: parentCenterId ?? undefined,
		});
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
