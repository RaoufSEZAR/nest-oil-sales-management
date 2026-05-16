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
exports.ErpReturnsController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const sales_return_status_enum_1 = require("./enums/sales-return-status.enum");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const user_role_enum_1 = require("../users/enums/user-role.enum");
const returns_service_1 = require("./returns.service");
const documents_dto_1 = require("./dto/documents.dto");
const api_tags_1 = require("../swagger/api-tags");
let ErpReturnsController = class ErpReturnsController {
    constructor(returns) {
        this.returns = returns;
    }
    getReport(from_date, to_date, status) {
        return this.returns.getReport({ from_date, to_date, status });
    }
    findAll(customer_id, sales_rep_id, status, from_date, to_date) {
        return this.returns.findAll({
            customer_id: customer_id ? parseInt(customer_id, 10) : undefined,
            sales_rep_id,
            status,
            from_date,
            to_date,
        });
    }
    findOne(id) {
        return this.returns.findOne(id);
    }
    create(dto) {
        return this.returns.create(dto);
    }
    updateStatus(id, body) {
        return this.returns.updateStatus(id, body.status, body.manager_notes);
    }
};
exports.ErpReturnsController = ErpReturnsController;
__decorate([
    (0, common_1.Get)("report"),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.SUPER_ADMIN, user_role_enum_1.UserRole.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: "Returns report by product (legacy)" }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)("from_date")),
    __param(1, (0, common_1.Query)("to_date")),
    __param(2, (0, common_1.Query)("status")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], ErpReturnsController.prototype, "getReport", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.SUPER_ADMIN, user_role_enum_1.UserRole.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: "List sales returns" }),
    (0, swagger_1.ApiQuery)({ name: "customer_id", required: false }),
    (0, swagger_1.ApiQuery)({ name: "sales_rep_id", required: false }),
    (0, swagger_1.ApiQuery)({ name: "status", required: false, enum: sales_return_status_enum_1.SalesReturnStatus }),
    (0, swagger_1.ApiQuery)({ name: "from_date", required: false }),
    (0, swagger_1.ApiQuery)({ name: "to_date", required: false }),
    openapi.ApiResponse({ status: 200, type: [require("./entities/sales-return.entity").SalesReturn] }),
    __param(0, (0, common_1.Query)("customer_id")),
    __param(1, (0, common_1.Query)("sales_rep_id")),
    __param(2, (0, common_1.Query)("status")),
    __param(3, (0, common_1.Query)("from_date")),
    __param(4, (0, common_1.Query)("to_date")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", void 0)
], ErpReturnsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(":id"),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.SUPER_ADMIN, user_role_enum_1.UserRole.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: "Get return by id" }),
    openapi.ApiResponse({ status: 200, type: require("./entities/sales-return.entity").SalesReturn }),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ErpReturnsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({
        summary: "Create sales return (pending until approved)",
    }),
    openapi.ApiResponse({ status: 201, type: require("./entities/sales-return.entity").SalesReturn }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [documents_dto_1.CreateSalesReturnDto]),
    __metadata("design:returntype", void 0)
], ErpReturnsController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(":id/status"),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: "Approve or reject return (legacy)" }),
    openapi.ApiResponse({ status: 200, type: require("./entities/sales-return.entity").SalesReturn }),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], ErpReturnsController.prototype, "updateStatus", null);
exports.ErpReturnsController = ErpReturnsController = __decorate([
    (0, swagger_1.ApiTags)(api_tags_1.SwaggerTags.ErpSalesReturns),
    (0, common_1.Controller)("returns"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [returns_service_1.ErpReturnsService])
], ErpReturnsController);
//# sourceMappingURL=returns.controller.js.map