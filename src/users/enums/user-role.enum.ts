export enum UserRole {
	USER = "user",
	ADMIN = "admin",
	SUPER_ADMIN = "super_admin",
	MANAGER = "manager",
}

export const DEFAULT_USER_ROLE = UserRole.USER;

/** Roles that can manage users (list, create, read, update, delete, activate). */
export const USER_MANAGEMENT_ROLES = [
	UserRole.ADMIN,
	UserRole.SUPER_ADMIN,
	UserRole.MANAGER,
] as const;
