import { UserRole } from "src/users/enums/user-role.enum";
import { Center } from "src/centers/entities/center.entity";
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
    centerId?: number | null;
    center?: Center | null;
    createdAt: Date;
    updatedAt: Date;
}
