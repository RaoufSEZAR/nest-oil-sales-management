import { Repository } from "typeorm";
import { VehicleTrip } from "src/erp/entities/vehicle-trip.entity";
import { CreateVehicleTripDto, UpdateVehicleTripDto } from "src/erp/dto/documents.dto";
import { SequenceService } from "src/erp/sequence.service";
import { TripStatus } from "src/erp/enums/trip-status.enum";
export declare class ErpVehicleTripsService {
    private readonly repo;
    private readonly sequences;
    constructor(repo: Repository<VehicleTrip>, sequences: SequenceService);
    findAll(filters?: {
        vehicle_id?: number;
        status?: TripStatus;
    }): Promise<VehicleTrip[]>;
    findActiveByVehicle(vehicleId: number): Promise<VehicleTrip | null>;
    findOne(id: number): Promise<VehicleTrip>;
    create(dto: CreateVehicleTripDto): Promise<VehicleTrip>;
    update(id: number, dto: UpdateVehicleTripDto): Promise<VehicleTrip>;
}
