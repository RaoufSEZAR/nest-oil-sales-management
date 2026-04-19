import { ErpVehicleTripsService } from "src/erp/vehicle-trips.service";
import { CreateVehicleTripDto, UpdateVehicleTripDto } from "src/erp/dto/documents.dto";
export declare class ErpVehicleTripsController {
    private readonly trips;
    constructor(trips: ErpVehicleTripsService);
    findAll(): Promise<import("./entities/vehicle-trip.entity").VehicleTrip[]>;
    findOne(id: number): Promise<import("./entities/vehicle-trip.entity").VehicleTrip>;
    create(dto: CreateVehicleTripDto): Promise<import("./entities/vehicle-trip.entity").VehicleTrip>;
    update(id: number, dto: UpdateVehicleTripDto): Promise<import("./entities/vehicle-trip.entity").VehicleTrip>;
}
