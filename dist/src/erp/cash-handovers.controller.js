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
exports.ErpCashHandoversController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const user_role_enum_1 = require("../users/enums/user-role.enum");
const cash_handovers_service_1 = require("./cash-handovers.service");
const documents_dto_1 = require("./dto/documents.dto");
let ErpCashHandoversController = class ErpCashHandoversController {
    constructor(handovers) {
        this.handovers = handovers;
    }
    findAll() {
        return this.handovers.findAll();
    }
    findOne(id) {
        return this.handovers.findOne(id);
    }
    create(dto) {
        return this.handovers.create(dto);
    }
    update(id, dto) {
        return this.handovers.update(id, dto);
    }
};
exports.ErpCashHandoversController = ErpCashHandoversController;
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.SUPER_ADMIN, user_role_enum_1.UserRole.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: "List cash handovers" }),
    openapi.ApiResponse({ status: 200, type: [require("./entities/cash-handover.entity").CashHandover] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ErpCashHandoversController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(":id"),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.SUPER_ADMIN, user_role_enum_1.UserRole.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: "Get handover by id" }),
    openapi.ApiResponse({ status: 200, type: require("./entities/cash-handover.entity").CashHandover }),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ErpCashHandoversController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: "Create cash handover" }),
    openapi.ApiResponse({ status: 201, type: require("./entities/cash-handover.entity").CashHandover }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [documents_dto_1.CreateCashHandoverDto]),
    __metadata("design:returntype", void 0)
], ErpCashHandoversController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(":id"),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: "Update handover (confirm / reject)" }),
    openapi.ApiResponse({ status: 200, type: require("./entities/cash-handover.entity").CashHandover }),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, documents_dto_1.UpdateCashHandoverDto]),
    __metadata("design:returntype", void 0)
], ErpCashHandoversController.prototype, "update", null);
exports.ErpCashHandoversController = ErpCashHandoversController = __decorate([
    (0, swagger_1.ApiTags)("ERP — Cash handovers"),
    (0, common_1.Controller)("cash-handovers"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [cash_handovers_service_1.ErpCashHandoversService])
], ErpCashHandoversController);
//# sourceMappingURL=cash-handovers.controller.js.map