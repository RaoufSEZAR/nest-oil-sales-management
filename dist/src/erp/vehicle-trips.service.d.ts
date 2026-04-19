import { Repository } from "typeorm";
import { VehicleTrip } from "src/erp/entities/vehicle-trip.entity";
import { CreateVehicleTripDto, UpdateVehicleTripDto } from "src/erp/dto/documents.dto";
import { SequenceService } from "src/erp/sequence.service";
export declare class ErpVehicleTripsService {
    private readonly repo;
    private readonly sequences;
    constructor(repo: Repository<VehicleTrip>, sequences: SequenceService);
    findAll(): Promise<VehicleTrip[]>;
    findOne(id: number): Promise<VehicleTrip>;
    create(dto: CreateVehicleTripDto): Promise<VehicleTrip>;
    update(id: number, dto: UpdateVehicleTripDto): Promise<VehicleTrip>;
}
