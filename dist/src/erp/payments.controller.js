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
exports.ErpPaymentsController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const user_role_enum_1 = require("../users/enums/user-role.enum");
const payments_service_1 = require("./payments.service");
const documents_dto_1 = require("./dto/documents.dto");
const api_tags_1 = require("../swagger/api-tags");
let ErpPaymentsController = class ErpPaymentsController {
    constructor(payments) {
        this.payments = payments;
    }
    findByCustomer(customerId) {
        return this.payments.findByCustomer(customerId);
    }
    findAll(customer_id, received_by, from_date, to_date) {
        return this.payments.findAll({
            customer_id: customer_id ? parseInt(customer_id, 10) : undefined,
            received_by,
            from_date,
            to_date,
        });
    }
    findOne(id) {
        return this.payments.findOne(id);
    }
    create(dto) {
        return this.payments.create(dto);
    }
    update(id, dto) {
        return this.payments.update(id, dto);
    }
    remove(id) {
        return this.payments.remove(id);
    }
};
exports.ErpPaymentsController = ErpPaymentsController;
__decorate([
    (0, common_1.Get)("customer/:customer_id"),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.SUPER_ADMIN, user_role_enum_1.UserRole.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: "Payments for a customer (legacy)" }),
    openapi.ApiResponse({ status: 200, type: [require("./entities/payment.entity").Payment] }),
    __param(0, (0, common_1.Param)("customer_id", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ErpPaymentsController.prototype, "findByCustomer", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.SUPER_ADMIN, user_role_enum_1.UserRole.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: "List payments" }),
    (0, swagger_1.ApiQuery)({ name: "customer_id", required: false }),
    (0, swagger_1.ApiQuery)({ name: "received_by", required: false }),
    (0, swagger_1.ApiQuery)({ name: "from_date", required: false }),
    (0, swagger_1.ApiQuery)({ name: "to_date", required: false }),
    openapi.ApiResponse({ status: 200, type: [require("./entities/payment.entity").Payment] }),
    __param(0, (0, common_1.Query)("customer_id")),
    __param(1, (0, common_1.Query)("received_by")),
    __param(2, (0, common_1.Query)("from_date")),
    __param(3, (0, common_1.Query)("to_date")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", void 0)
], ErpPaymentsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(":id"),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.SUPER_ADMIN, user_role_enum_1.UserRole.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: "Get payment by id" }),
    openapi.ApiResponse({ status: 200, type: require("./entities/payment.entity").Payment }),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ErpPaymentsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: "Create payment" }),
    openapi.ApiResponse({ status: 201, type: require("./entities/payment.entity").Payment }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [documents_dto_1.CreatePaymentDto]),
    __metadata("design:returntype", void 0)
], ErpPaymentsController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(":id"),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: "Update payment" }),
    openapi.ApiResponse({ status: 200, type: require("./entities/payment.entity").Payment }),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, documents_dto_1.CreatePaymentDto]),
    __metadata("design:returntype", void 0)
], ErpPaymentsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":id"),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: "Delete payment" }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ErpPaymentsController.prototype, "remove", null);
exports.ErpPaymentsController = ErpPaymentsController = __decorate([
    (0, swagger_1.ApiTags)(api_tags_1.SwaggerTags.ErpPayments),
    (0, common_1.Controller)("payments"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [payments_service_1.ErpPaymentsService])
], ErpPaymentsController);
//# sourceMappingURL=payments.controller.js.map