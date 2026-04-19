import {
	BadRequestException,
	ConflictException,
	Injectable,
	NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Vehicle } from "src/vehicles/entities/vehicle.entity";
import { Center } from "src/centers/entities/center.entity";
import { User } from "src/users/entities/user.entity";
import { CreateVehicleDto } from "src/vehicles/dto/create-vehicle.dto";
import { UpdateVehicleDto } from "src/vehicles/dto/update-vehicle.dto";

@Injectable()
export class VehiclesService {
	constructor(
		@InjectRepository(Vehicle)
		private readonly vehiclesRepo: Repository<Vehicle>,
		@InjectRepository(Center)
		private readonly centersRepo: Repository<Center>,
		@InjectRepository(User)
		private readonly usersRepo: Repository<User>,
	) {}

	async findAll(filters: {
		centerId?: number;
		active?: boolean;
	}): Promise<Vehicle[]> {
		const qb = this.vehiclesRepo
			.createQueryBuilder("v")
			.leftJoinAndSelect("v.center", "center")
			.leftJoinAndSelect("v.currentSalesRep", "currentSalesRep")
			.orderBy("v.name", "ASC");

		if (filters.centerId !== undefined) {
			qb.andWhere("v.centerId = :centerId", { centerId: filters.centerId });
		}
		if (filters.active !== undefined) {
			qb.andWhere("v.active = :active", { active: filters.active });
		}

		const rows = await qb.getMany();
		for (const v of rows) {
			if (v.currentSalesRep) {
				delete (v.currentSalesRep as { password?: string }).password;
			}
		}
		return rows;
	}

	async findOne(id: number): Promise<Vehicle> {
		const vehicle = await this.vehiclesRepo.findOne({
			where: { id },
			relations: { center: true, currentSalesRep: true },
		});
		if (!vehicle) {
			throw new NotFoundException("Vehicle not found");
		}
		if (vehicle.currentSalesRep) {
			delete (vehicle.currentSalesRep as { password?: string }).password;
		}
		return vehicle;
	}

	async create(dto: CreateVehicleDto): Promise<Vehicle> {
		const center = await this.centersRepo.findOne({
			where: { id: dto.centerId },
		});
		if (!center) {
			throw new BadRequestException("Center not found");
		}
		const dup = await this.vehiclesRepo.findOne({ where: { code: dto.code } });
		if (dup) {
			throw new ConflictException("Vehicle code already exists");
		}
		if (dto.currentSalesRepId) {
			const rep = await this.usersRepo.findOne({
				where: { id: dto.currentSalesRepId },
			});
			if (!rep) {
				throw new BadRequestException("Sales rep user not found");
			}
		}

		const vehicle = this.vehiclesRepo.create({
			name: dto.name,
			code: dto.code,
			licensePlate: dto.licensePlate ?? null,
			centerId: dto.centerId,
			currentSalesRepId: dto.currentSalesRepId ?? null,
			vehicleType: dto.vehicleType ?? null,
			active: true,
		});
		return this.vehiclesRepo.save(vehicle);
	}

	async update(id: number, dto: UpdateVehicleDto): Promise<Vehicle> {
		const vehicle = await this.vehiclesRepo.findOne({ where: { id } });
		if (!vehicle) {
			throw new NotFoundException("Vehicle not found");
		}
		if (dto.code && dto.code !== vehicle.code) {
			const dup = await this.vehiclesRepo.findOne({
				where: { code: dto.code },
			});
			if (dup) {
				throw new ConflictException("Vehicle code already exists");
			}
		}
		if (dto.centerId != null) {
			const center = await this.centersRepo.findOne({
				where: { id: dto.centerId },
			});
			if (!center) {
				throw new BadRequestException("Center not found");
			}
		}
		if (dto.currentSalesRepId) {
			const rep = await this.usersRepo.findOne({
				where: { id: dto.currentSalesRepId },
			});
			if (!rep) {
				throw new BadRequestException("Sales rep user not found");
			}
		}

		Object.assign(vehicle, {
			...(dto.name !== undefined && { name: dto.name }),
			...(dto.code !== undefined && { code: dto.code }),
			...(dto.licensePlate !== undefined && {
				licensePlate: dto.licensePlate,
			}),
			...(dto.centerId !== undefined && { centerId: dto.centerId }),
			...(dto.currentSalesRepId !== undefined && {
				currentSalesRepId: dto.currentSalesRepId,
			}),
			...(dto.vehicleType !== undefined && { vehicleType: dto.vehicleType }),
			...(dto.active !== undefined && { active: dto.active }),
		});

		return this.vehiclesRepo.save(vehicle);
	}
}
