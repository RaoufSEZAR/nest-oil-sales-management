import { ErpVehicleTripsService } from "src/erp/vehicle-trips.service";
import { CreateVehicleTripDto, UpdateVehicleTripDto } from "src/erp/dto/documents.dto";
import { TripStatus } from "src/erp/enums/trip-status.enum";
export declare class TripsLegacyController {
    private readonly trips;
    constructor(trips: ErpVehicleTripsService);
    findActive(vehicleIdRaw: string): Promise<import("../entities/vehicle-trip.entity").VehicleTrip>;
    findAll(vehicle_id?: string, status?: TripStatus): Promise<import("../entities/vehicle-trip.entity").VehicleTrip[]>;
    findOne(id: number): Promise<import("../entities/vehicle-trip.entity").VehicleTrip>;
    create(dto: CreateVehicleTripDto): Promise<import("../entities/vehicle-trip.entity").VehicleTrip>;
    update(id: number, dto: UpdateVehicleTripDto): Promise<import("../entities/vehicle-trip.entity").VehicleTrip>;
}
