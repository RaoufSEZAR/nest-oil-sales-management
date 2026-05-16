"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const users_service_1 = require("./users.service");
const hr_service_1 = require("./hr.service");
const update_hr_settings_dto_1 = require("./dto/update-hr-settings.dto");
const create_user_dto_1 = require("./dto/create-user.dto");
const update_user_dto_1 = require("./dto/update-user.dto");
const assign_center_dto_1 = require("./dto/assign-center.dto");
const assign_vehicle_dto_1 = require("./dto/assign-vehicle.dto");
const unassign_dto_1 = require("./dto/unassign.dto");
const reset_password_dto_1 = require("./dto/reset-password.dto");
const user_entity_1 = require("./entities/user.entity");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const user_role_enum_1 = require("./enums/user-role.enum");
let UsersController = class UsersController {
    constructor(usersService, hrService) {
        this.usersService = usersService;
        this.hrService = hrService;
    }
    create(createUserDto) {
        return this.usersService.create(createUserDto);
    }
    getMe(req) {
        return this.usersService.findOneWithRelations(req.user.userId);
    }
    findByCenter(centerId) {
        return this.usersService.findByCenter(centerId);
    }
    getHrSettings() {
        return this.hrService.getHrSettings();
    }
    getMonthlyPayroll(month) {
        return this.hrService.getMonthlyPayroll(month);
    }
    findAll(page, limit, role, centerIdRaw, activeRaw) {
        const pageNum = page ? parseInt(page.toString(), 10) : 1;
        const limitNum = limit ? parseInt(limit.toString(), 10) : 10;
        const centerId = centerIdRaw !== undefined && centerIdRaw !== ""
            ? parseInt(centerIdRaw, 10)
            : undefined;
        let active;
        if (activeRaw === "true")
            active = true;
        else if (activeRaw === "false")
            active = false;
        return this.usersService.findAll(pageNum, limitNum, {
            role,
            centerId,
            active,
        });
    }
    findOne(id) {
        return this.usersService.findOneWithRelations(id);
    }
    assignToCenter(id, dto) {
        return this.usersService.assignToCenter(id, dto.center_id);
    }
    assignToVehicle(id, dto) {
        return this.usersService.assignToVehicle(id, dto.vehicle_id);
    }
    unassign(id, dto) {
        return this.usersService.unassign(id, dto.remove);
    }
    updateHrSettings(id, dto) {
        return this.hrService.updateHrSettings(id, dto);
    }
    toggleActive(id) {
        return this.usersService.toggleActive(id);
    }
    resetPassword(id, dto) {
        return this.usersService.resetPassword(id, dto.password);
    }
    deactivate(id) {
        return this.usersService.deactivate(id);
    }
    activate(id) {
        return this.usersService.activate(id);
    }
    update(id, updateUserDto, req) {
        const allowStaffPasswordReset = user_role_enum_1.USER_MANAGEMENT_ROLES.some((role) => role === req.user.role);
        return this.usersService.update(id, updateUserDto, {
            allowStaffPasswordReset,
        });
    }
    remove(id) {
        return this.usersService.remove(id);
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(...user_role_enum_1.USER_MANAGEMENT_ROLES),
    (0, swagger_1.ApiOperation)({ summary: "Create a new user (admin, super admin, or manager)" }),
    (0, swagger_1.ApiResponse)({ status: 201, description: "User created successfully", type: user_entity_1.User }),
    openapi.ApiResponse({ status: 201, type: require("./entities/user.entity").User }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)("me"),
    (0, roles_decorator_1.Roles)(...user_role_enum_1.USER_MANAGEMENT_ROLES, user_role_enum_1.UserRole.USER),
    (0, swagger_1.ApiOperation)({
        summary: "Current user profile with center and vehicle (legacy GET /users/me)",
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Profile found", type: user_entity_1.User }),
    openapi.ApiResponse({ status: 200, type: require("./entities/user.entity").User }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "getMe", null);
__decorate([
    (0, common_1.Get)("center/:center_id"),
    (0, roles_decorator_1.Roles)(...user_role_enum_1.USER_MANAGEMENT_ROLES),
    (0, swagger_1.ApiOperation)({
        summary: "Users assigned to a center (legacy GET /users/center/:center_id)",
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Users retrieved", type: [user_entity_1.User] }),
    openapi.ApiResponse({ status: 200, type: [require("./entities/user.entity").User] }),
    __param(0, (0, common_1.Param)("center_id", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "findByCenter", null);
__decorate([
    (0, common_1.Get)("hr/settings"),
    (0, roles_decorator_1.Roles)(...user_role_enum_1.USER_MANAGEMENT_ROLES),
    (0, swagger_1.ApiOperation)({ summary: "HR settings for all active users (legacy)" }),
    openapi.ApiResponse({ status: 200, type: [require("./entities/user.entity").User] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "getHrSettings", null);
__decorate([
    (0, common_1.Get)("hr/payroll/:month"),
    (0, roles_decorator_1.Roles)(...user_role_enum_1.USER_MANAGEMENT_ROLES),
    (0, swagger_1.ApiOperation)({ summary: "Monthly payroll report (legacy)" }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)("month")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "getMonthlyPayroll", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(...user_role_enum_1.USER_MANAGEMENT_ROLES),
    (0, swagger_1.ApiOperation)({ summary: "List users with optional filters and pagination" }),
    (0, swagger_1.ApiQuery)({ name: "page", required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: "limit", required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: "role", required: false, enum: user_role_enum_1.UserRole }),
    (0, swagger_1.ApiQuery)({ name: "center_id", required: false, type: Number }),
    (0, swagger_1.ApiQuery)({
        name: "active",
        required: false,
        type: Boolean,
        description: "Filter by isActive (true/false)",
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Users retrieved successfully" }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)("page")),
    __param(1, (0, common_1.Query)("limit")),
    __param(2, (0, common_1.Query)("role")),
    __param(3, (0, common_1.Query)("center_id")),
    __param(4, (0, common_1.Query)("active")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String, String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(":id"),
    (0, roles_decorator_1.Roles)(...user_role_enum_1.USER_MANAGEMENT_ROLES, user_role_enum_1.UserRole.USER),
    (0, swagger_1.ApiOperation)({ summary: "Get user by ID (staff managers or own profile)" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "User found", type: user_entity_1.User }),
    openapi.ApiResponse({ status: 200, type: require("./entities/user.entity").User }),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(":id/assign-center"),
    (0, roles_decorator_1.Roles)(...user_role_enum_1.USER_MANAGEMENT_ROLES),
    (0, swagger_1.ApiOperation)({
        summary: "Assign user to center (legacy PUT /users/:id/assign-center)",
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "User assigned to center", type: user_entity_1.User }),
    openapi.ApiResponse({ status: 200, type: require("./entities/user.entity").User }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, assign_center_dto_1.AssignCenterDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "assignToCenter", null);
__decorate([
    (0, common_1.Put)(":id/assign-vehicle"),
    (0, roles_decorator_1.Roles)(...user_role_enum_1.USER_MANAGEMENT_ROLES),
    (0, swagger_1.ApiOperation)({
        summary: "Assign user to vehicle (legacy PUT /users/:id/assign-vehicle)",
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "User assigned to vehicle", type: user_entity_1.User }),
    openapi.ApiResponse({ status: 200, type: require("./entities/user.entity").User }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, assign_vehicle_dto_1.AssignVehicleDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "assignToVehicle", null);
__decorate([
    (0, common_1.Put)(":id/unassign"),
    (0, roles_decorator_1.Roles)(...user_role_enum_1.USER_MANAGEMENT_ROLES),
    (0, swagger_1.ApiOperation)({
        summary: "Unassign user from vehicle/center (legacy PUT /users/:id/unassign)",
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Assignment removed", type: user_entity_1.User }),
    openapi.ApiResponse({ status: 200, type: require("./entities/user.entity").User }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, unassign_dto_1.UnassignDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "unassign", null);
__decorate([
    (0, common_1.Put)(":id/hr-settings"),
    (0, roles_decorator_1.Roles)(...user_role_enum_1.USER_MANAGEMENT_ROLES),
    (0, swagger_1.ApiOperation)({ summary: "Update HR settings for a user (legacy)" }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_hr_settings_dto_1.UpdateHrSettingsDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "updateHrSettings", null);
__decorate([
    (0, common_1.Put)(":id/toggle-active"),
    (0, roles_decorator_1.Roles)(...user_role_enum_1.USER_MANAGEMENT_ROLES),
    (0, swagger_1.ApiOperation)({
        summary: "Toggle user active flag (legacy PUT /users/:id/toggle-active)",
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "User active status toggled", type: user_entity_1.User }),
    openapi.ApiResponse({ status: 200, type: require("./entities/user.entity").User }),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "toggleActive", null);
__decorate([
    (0, common_1.Patch)(":id/reset-password"),
    (0, roles_decorator_1.Roles)(...user_role_enum_1.USER_MANAGEMENT_ROLES),
    (0, swagger_1.ApiOperation)({
        summary: "Reset user password (legacy admin reset, min 4 chars)",
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Password reset successfully" }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, reset_password_dto_1.ResetPasswordDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "resetPassword", null);
__decorate([
    (0, common_1.Patch)(":id/deactivate"),
    (0, roles_decorator_1.Roles)(...user_role_enum_1.USER_MANAGEMENT_ROLES),
    (0, swagger_1.ApiOperation)({ summary: "Deactivate user" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "User deactivated", type: user_entity_1.User }),
    openapi.ApiResponse({ status: 200, type: require("./entities/user.entity").User }),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "deactivate", null);
__decorate([
    (0, common_1.Patch)(":id/activate"),
    (0, roles_decorator_1.Roles)(...user_role_enum_1.USER_MANAGEMENT_ROLES),
    (0, swagger_1.ApiOperation)({ summary: "Activate user" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "User activated", type: user_entity_1.User }),
    openapi.ApiResponse({ status: 200, type: require("./entities/user.entity").User }),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "activate", null);
__decorate([
    (0, common_1.Patch)(":id"),
    (0, roles_decorator_1.Roles)(...user_role_enum_1.USER_MANAGEMENT_ROLES, user_role_enum_1.UserRole.USER),
    (0, swagger_1.ApiOperation)({ summary: "Update user (staff managers or own profile)" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "User updated", type: user_entity_1.User }),
    openapi.ApiResponse({ status: 200, type: require("./entities/user.entity").User }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_user_dto_1.UpdateUserDto, Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":id"),
    (0, roles_decorator_1.Roles)(...user_role_enum_1.USER_MANAGEMENT_ROLES, user_role_enum_1.UserRole.USER),
    (0, swagger_1.ApiOperation)({ summary: "Delete user" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "User deleted" }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "remove", null);
exports.UsersController = UsersController = __decorate([
    (0, swagger_1.ApiTags)("Users"),
    (0, common_1.Controller)("users"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        hr_service_1.HrService])
], UsersController);
//# sourceMappingURL=users.controller.js.map