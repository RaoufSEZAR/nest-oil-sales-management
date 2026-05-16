import { Center } from "src/centers/entities/center.entity";
import { User } from "src/users/entities/user.entity";
import { VehicleTrip } from "src/erp/entities/vehicle-trip.entity";
export declare class Vehicle {
    id: number;
    name: string;
    code: string;
    licensePlate?: string | null;
    centerId: number;
    center: Center;
    currentSalesRepId?: string | null;
    currentSalesRep?: User | null;
    trips?: VehicleTrip[];
    vehicleType?: string | null;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
}
