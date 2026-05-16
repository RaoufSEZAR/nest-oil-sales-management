import { UserRole } from "src/users/enums/user-role.enum";
import { Center } from "src/centers/entities/center.entity";
import { Vehicle } from "src/vehicles/entities/vehicle.entity";
export declare class User {
    id: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    address?: string;
    preferredLang?: string;
    region?: string;
    role: UserRole;
    isActive: boolean;
    baseSalary?: string | null;
    commissionRate?: string | null;
    commissionBasis?: string | null;
    centerId?: number | null;
    center?: Center | null;
    vehicleId?: number | null;
    vehicle?: Vehicle | null;
    createdAt: Date;
    updatedAt: Date;
}
