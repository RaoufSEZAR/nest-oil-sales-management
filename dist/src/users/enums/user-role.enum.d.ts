export declare enum UserRole {
    USER = "user",
    ADMIN = "admin",
    SUPER_ADMIN = "super_admin",
    MANAGER = "manager"
}
export declare const DEFAULT_USER_ROLE = UserRole.USER;
export declare const USER_MANAGEMENT_ROLES: readonly [UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.MANAGER];
export declare const ERP_MANAGEMENT_ROLES: readonly [UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.MANAGER];
