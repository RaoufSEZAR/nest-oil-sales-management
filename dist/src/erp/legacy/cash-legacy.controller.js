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
exports.CashLegacyController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../auth/guards/roles.guard");
const roles_decorator_1 = require("../../auth/decorators/roles.decorator");
const user_role_enum_1 = require("../../users/enums/user-role.enum");
const cash_handovers_service_1 = require("../cash-handovers.service");
const documents_dto_1 = require("../dto/documents.dto");
const cash_handover_status_enum_1 = require("../enums/cash-handover-status.enum");
let CashLegacyController = class CashLegacyController {
    constructor(handovers) {
        this.handovers = handovers;
    }
    getVehicleHandovers(vehicleId, status) {
        return this.handovers.findFiltered({
            from_type: "vehicle",
            from_id: vehicleId,
            status,
        });
    }
    getCenterHandovers(centerId, status) {
        return this.handovers.findFiltered({
            to_type: "center",
            to_id: centerId,
            status,
        });
    }
    findAll(from_type, from_id, status) {
        return this.handovers.findFiltered({
            from_type,
            from_id: from_id ? parseInt(from_id, 10) : undefined,
            status,
        });
    }
    findOne(id) {
        return this.handovers.findOne(id);
    }
    create(req, dto) {
        return this.handovers.create({
            ...dto,
            handedById: dto.handedById ?? req.user.userId,
        });
    }
    confirm(id, req) {
        return this.handovers.confirm(id, req.user.userId);
    }
    reject(id, body) {
        return this.handovers.reject(id, body.notes);
    }
    update(id, dto) {
        return this.handovers.update(id, dto);
    }
};
exports.CashLegacyController = CashLegacyController;
__decorate([
    (0, common_1.Get)("vehicle/:vehicle_id"),
    (0, roles_decorator_1.Roles)(...user_role_enum_1.ERP_MANAGEMENT_ROLES, user_role_enum_1.UserRole.USER),
    (0, swagger_1.ApiQuery)({ name: "status", required: false }),
    openapi.ApiResponse({ status: 200, type: [require("../entities/cash-handover.entity").CashHandover] }),
    __param(0, (0, common_1.Param)("vehicle_id", common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)("status")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", void 0)
], CashLegacyController.prototype, "getVehicleHandovers", null);
__decorate([
    (0, common_1.Get)("center/:center_id"),
    (0, roles_decorator_1.Roles)(...user_role_enum_1.ERP_MANAGEMENT_ROLES),
    openapi.ApiResponse({ status: 200, type: [require("../entities/cash-handover.entity").CashHandover] }),
    __param(0, (0, common_1.Param)("center_id", common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)("status")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", void 0)
], CashLegacyController.prototype, "getCenterHandovers", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(...user_role_enum_1.ERP_MANAGEMENT_ROLES),
    openapi.ApiResponse({ status: 200, type: [require("../entities/cash-handover.entity").CashHandover] }),
    __param(0, (0, common_1.Query)("from_type")),
    __param(1, (0, common_1.Query)("from_id")),
    __param(2, (0, common_1.Query)("status")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], CashLegacyController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(":id"),
    (0, roles_decorator_1.Roles)(...user_role_enum_1.ERP_MANAGEMENT_ROLES),
    openapi.ApiResponse({ status: 200, type: require("../entities/cash-handover.entity").CashHandover }),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], CashLegacyController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(...user_role_enum_1.ERP_MANAGEMENT_ROLES, user_role_enum_1.UserRole.USER),
    openapi.ApiResponse({ status: 201, type: require("../entities/cash-handover.entity").CashHandover }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, documents_dto_1.CreateCashHandoverDto]),
    __metadata("design:returntype", void 0)
], CashLegacyController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(":id/confirm"),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.SUPER_ADMIN, user_role_enum_1.UserRole.MANAGER),
    openapi.ApiResponse({ status: 200, type: require("../entities/cash-handover.entity").CashHandover }),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], CashLegacyController.prototype, "confirm", null);
__decorate([
    (0, common_1.Patch)(":id/reject"),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.SUPER_ADMIN, user_role_enum_1.UserRole.MANAGER),
    openapi.ApiResponse({ status: 200, type: require("../entities/cash-handover.entity").CashHandover }),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], CashLegacyController.prototype, "reject", null);
__decorate([
    (0, common_1.Patch)(":id"),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.SUPER_ADMIN),
    openapi.ApiResponse({ status: 200, type: require("../entities/cash-handover.entity").CashHandover }),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, documents_dto_1.UpdateCashHandoverDto]),
    __metadata("design:returntype", void 0)
], CashLegacyController.prototype, "update", null);
exports.CashLegacyController = CashLegacyController = __decorate([
    (0, swagger_1.ApiTags)("Cash (legacy)"),
    (0, common_1.Controller)("cash"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [cash_handovers_service_1.ErpCashHandoversService])
], CashLegacyController);
//# sourceMappingURL=cash-legacy.controller.js.map