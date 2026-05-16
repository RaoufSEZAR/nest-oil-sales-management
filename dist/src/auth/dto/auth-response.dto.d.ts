import { UserRole } from "src/users/enums/user-role.enum";
export declare class AuthResponseDto {
    access_token: string;
    refresh_token: string;
    access_token_expires_at: Date;
    refresh_token_expires_at: Date;
}
export declare class UserProfileDto {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    gender?: string;
    phoneNumber?: string;
    address?: string;
    preferredLang?: string;
    region?: string;
}
