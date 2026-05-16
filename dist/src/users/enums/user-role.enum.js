"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ERP_MANAGEMENT_ROLES = exports.USER_MANAGEMENT_ROLES = exports.DEFAULT_USER_ROLE = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["USER"] = "user";
    UserRole["ADMIN"] = "admin";
    UserRole["SUPER_ADMIN"] = "super_admin";
    UserRole["MANAGER"] = "manager";
})(UserRole || (exports.UserRole = UserRole = {}));
exports.DEFAULT_USER_ROLE = UserRole.USER;
exports.USER_MANAGEMENT_ROLES = [
    UserRole.ADMIN,
    UserRole.SUPER_ADMIN,
    UserRole.MANAGER,
];
exports.ERP_MANAGEMENT_ROLES = exports.USER_MANAGEMENT_ROLES;
//# sourceMappingURL=user-role.enum.js.map