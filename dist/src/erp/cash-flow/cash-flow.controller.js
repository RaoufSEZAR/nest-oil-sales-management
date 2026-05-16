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
exports.CashFlowController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../auth/guards/roles.guard");
const roles_decorator_1 = require("../../auth/decorators/roles.decorator");
const user_role_enum_1 = require("../../users/enums/user-role.enum");
const cash_flow_service_1 = require("./cash-flow.service");
let CashFlowController = class CashFlowController {
    constructor(cashFlow) {
        this.cashFlow = cashFlow;
    }
    getMyCashFlow(req) {
        return this.cashFlow.getMyCashFlow(req.user.userId);
    }
    validateHandover(req, body) {
        return this.cashFlow.validateHandover(req.user.userId, body);
    }
};
exports.CashFlowController = CashFlowController;
__decorate([
    (0, common_1.Get)("me"),
    (0, roles_decorator_1.Roles)(...user_role_enum_1.ERP_MANAGEMENT_ROLES, user_role_enum_1.UserRole.USER),
    (0, swagger_1.ApiOperation)({ summary: "Sales rep cash ledger (legacy GET /cash-flow/me)" }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CashFlowController.prototype, "getMyCashFlow", null);
__decorate([
    (0, common_1.Post)("validate-handover"),
    (0, roles_decorator_1.Roles)(...user_role_enum_1.ERP_MANAGEMENT_ROLES, user_role_enum_1.UserRole.USER),
    (0, swagger_1.ApiOperation)({ summary: "Validate handover amount against balance" }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], CashFlowController.prototype, "validateHandover", null);
exports.CashFlowController = CashFlowController = __decorate([
    (0, swagger_1.ApiTags)("Cash-flow"),
    (0, common_1.Controller)("cash-flow"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [cash_flow_service_1.CashFlowService])
], CashFlowController);
//# sourceMappingURL=cash-flow.controller.js.map