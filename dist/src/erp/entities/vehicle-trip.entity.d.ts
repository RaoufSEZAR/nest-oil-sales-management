import { Vehicle } from "src/vehicles/entities/vehicle.entity";
import { User } from "src/users/entities/user.entity";
import { TripStatus } from "src/erp/enums/trip-status.enum";
export declare class VehicleTrip {
    id: number;
    tripNumber: string;
    vehicle: Vehicle;
    salesRep: User;
    tripDate: string;
    odometerStart: number;
    odometerStartPhoto?: string | null;
    odometerEnd?: number | null;
    odometerEndPhoto?: string | null;
    distanceKm?: number | null;
    fuelCompensation?: string | null;
    notes?: string | null;
    status: TripStatus;
    startedAt: Date;
    endedAt?: Date | null;
    createdAt: Date;
    updatedAt: Date;
}
