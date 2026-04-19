import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { VehicleTrip } from "src/erp/entities/vehicle-trip.entity";
import {
	CreateVehicleTripDto,
	UpdateVehicleTripDto,
} from "src/erp/dto/documents.dto";
import { SequenceService } from "src/erp/sequence.service";
import { TripStatus } from "src/erp/enums/trip-status.enum";
import { User } from "src/users/entities/user.entity";

function dec2(n: number): string {
	return n.toFixed(2);
}

@Injectable()
export class ErpVehicleTripsService {
	constructor(
		@InjectRepository(VehicleTrip)
		private readonly repo: Repository<VehicleTrip>,
		private readonly sequences: SequenceService,
	) {}

	findAll(): Promise<VehicleTrip[]> {
		return this.repo.find({
			order: { id: "DESC" },
			relations: { vehicle: true, salesRep: true },
		});
	}

	async findOne(id: number): Promise<VehicleTrip> {
		const row = await this.repo.findOne({
			where: { id },
			relations: { vehicle: true, salesRep: true },
		});
		if (!row) throw new NotFoundException(`Vehicle trip ${id} not found`);
		return row;
	}

	async create(dto: CreateVehicleTripDto): Promise<VehicleTrip> {
		const tripNumber = await this.sequences.next("TRIP");
		const entity = this.repo.create({
			tripNumber,
			vehicle: { id: dto.vehicleId },
			salesRep: { id: dto.salesRepId } as User,
			tripDate: dto.tripDate.slice(0, 10),
			odometerStart: dto.odometerStart,
			odometerStartPhoto: dto.odometerStartPhoto ?? null,
			notes: dto.notes ?? null,
			status: TripStatus.ACTIVE,
			startedAt: new Date(),
			endedAt: null,
		});
		return this.repo.save(entity);
	}

	async update(id: number, dto: UpdateVehicleTripDto): Promise<VehicleTrip> {
		const row = await this.findOne(id);
		if (dto.odometerEnd !== undefined) row.odometerEnd = dto.odometerEnd;
		if (dto.odometerEndPhoto !== undefined)
			row.odometerEndPhoto = dto.odometerEndPhoto ?? null;
		if (dto.fuelCompensation !== undefined)
			row.fuelCompensation = dec2(dto.fuelCompensation);
		if (dto.notes !== undefined) row.notes = dto.notes ?? null;
		if (dto.status !== undefined) row.status = dto.status;
		if (dto.endedAt !== undefined)
			row.endedAt = dto.endedAt ? new Date(dto.endedAt) : null;
		if (
			row.odometerEnd != null &&
			row.odometerStart != null &&
			dto.odometerEnd !== undefined
		) {
			row.distanceKm = Math.max(row.odometerEnd - row.odometerStart, 0);
		}
		return this.repo.save(row);
	}
}
