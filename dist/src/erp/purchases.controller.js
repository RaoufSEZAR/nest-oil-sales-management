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
exports.ErpPurchasesController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const user_role_enum_1 = require("../users/enums/user-role.enum");
const purchases_service_1 = require("./purchases.service");
const documents_dto_1 = require("./dto/documents.dto");
const api_tags_1 = require("../swagger/api-tags");
let ErpPurchasesController = class ErpPurchasesController {
    constructor(purchases) {
        this.purchases = purchases;
    }
    findAll() {
        return this.purchases.findAll();
    }
    findOne(id) {
        return this.purchases.findOne(id);
    }
    create(dto) {
        return this.purchases.create(dto);
    }
    update(id, dto) {
        return this.purchases.update(id, dto);
    }
    addDistribution(id, dto) {
        return this.purchases.addDistribution(id, dto);
    }
    confirmReceipt(id, req) {
        return this.purchases.confirmReceipt(id, req.user.userId);
    }
    rejectReceipt(id, req, body) {
        return this.purchases.rejectReceipt(id, req.user.userId, body.notes);
    }
    updatePayment(id, body) {
        return this.purchases.updatePayment(id, body);
    }
};
exports.ErpPurchasesController = ErpPurchasesController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: "List purchases" }),
    openapi.ApiResponse({ status: 200, type: [require("./entities/purchase.entity").Purchase] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ErpPurchasesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(":id"),
    (0, swagger_1.ApiOperation)({ summary: "Get purchase by id" }),
    openapi.ApiResponse({ status: 200, type: require("./entities/purchase.entity").Purchase }),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ErpPurchasesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({
        summary: "Create purchase with line items",
        description: "Increases **product stock** for each line that includes a `productId`.",
    }),
    openapi.ApiResponse({ status: 201, type: require("./entities/purchase.entity").Purchase }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [documents_dto_1.CreatePurchaseDto]),
    __metadata("design:returntype", void 0)
], ErpPurchasesController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(":id"),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: "Update purchase header fields" }),
    openapi.ApiResponse({ status: 200, type: require("./entities/purchase.entity").Purchase }),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, documents_dto_1.UpdatePurchaseDto]),
    __metadata("design:returntype", void 0)
], ErpPurchasesController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(":id/distributions"),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.SUPER_ADMIN, user_role_enum_1.UserRole.MANAGER),
    (0, swagger_1.ApiOperation)({
        summary: "Record stock distribution for a purchase",
        description: "Decreases **product stock** by the distributed quantity when sending stock to a center.",
    }),
    openapi.ApiResponse({ status: 201, type: require("./entities/purchase-distribution.entity").PurchaseDistribution }),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, documents_dto_1.CreatePurchaseDistributionDto]),
    __metadata("design:returntype", void 0)
], ErpPurchasesController.prototype, "addDistribution", null);
__decorate([
    (0, common_1.Patch)(":id/confirm-receipt"),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: "Confirm purchase receipt (legacy)" }),
    openapi.ApiResponse({ status: 200, type: require("./entities/purchase.entity").Purchase }),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], ErpPurchasesController.prototype, "confirmReceipt", null);
__decorate([
    (0, common_1.Patch)(":id/reject-receipt"),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: "Reject purchase receipt (legacy)" }),
    openapi.ApiResponse({ status: 200, type: require("./entities/purchase.entity").Purchase }),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", void 0)
], ErpPurchasesController.prototype, "rejectReceipt", null);
__decorate([
    (0, common_1.Patch)(":id/payment"),
    (0, swagger_1.ApiOperation)({ summary: "Update purchase payment (legacy)" }),
    openapi.ApiResponse({ status: 200, type: require("./entities/purchase.entity").Purchase }),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], ErpPurchasesController.prototype, "updatePayment", null);
exports.ErpPurchasesController = ErpPurchasesController = __decorate([
    (0, swagger_1.ApiTags)(api_tags_1.SwaggerTags.ErpPurchases),
    (0, common_1.Controller)("purchases"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(...user_role_enum_1.ERP_MANAGEMENT_ROLES),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [purchases_service_1.ErpPurchasesService])
], ErpPurchasesController);
//# sourceMappingURL=purchases.controller.js.map