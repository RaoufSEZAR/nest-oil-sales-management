import { Center } from "src/centers/entities/center.entity";
import { User } from "src/users/entities/user.entity";
export declare class Vehicle {
    id: number;
    name: string;
    code: string;
    licensePlate?: string | null;
    centerId: number;
    center: Center;
    currentSalesRepId?: string | null;
    currentSalesRep?: User | null;
    vehicleType?: string | null;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
}
