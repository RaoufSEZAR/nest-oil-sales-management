import { UserRole } from "src/users/enums/user-role.enum";
export declare class CreateUserDto {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    address?: string;
    preferredLang?: string;
    region?: string;
    role?: UserRole;
}
