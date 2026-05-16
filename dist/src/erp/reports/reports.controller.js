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
exports.ReportsController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../auth/guards/roles.guard");
const roles_decorator_1 = require("../../auth/decorators/roles.decorator");
const user_role_enum_1 = require("../../users/enums/user-role.enum");
const reports_service_1 = require("./reports.service");
let ReportsController = class ReportsController {
    constructor(reports) {
        this.reports = reports;
    }
    filters(from_date, to_date, sales_rep_id, customer_id, center_id, status) {
        return {
            from_date,
            to_date,
            sales_rep_id,
            customer_id: customer_id ? parseInt(customer_id, 10) : undefined,
            center_id: center_id ? parseInt(center_id, 10) : undefined,
            status,
        };
    }
    getSalesReport(from_date, to_date, sales_rep_id, customer_id) {
        return this.reports.getSalesReport(this.filters(from_date, to_date, sales_rep_id, customer_id));
    }
    getVehicleReport(vehicleId, from_date, to_date) {
        return this.reports.getVehicleReport(vehicleId, this.filters(from_date, to_date));
    }
    getCenterReport(centerId, from_date, to_date) {
        return this.reports.getCenterReport(centerId, this.filters(from_date, to_date));
    }
    getAdminReport(from_date, to_date) {
        return this.reports.getAdminReport(this.filters(from_date, to_date));
    }
    getInventoryReport() {
        return this.reports.getInventoryReport();
    }
    getCentersComparison(from_date, to_date) {
        return this.reports.getCentersComparison(this.filters(from_date, to_date));
    }
    getCashAudit(from_date, to_date, center_id) {
        return this.reports.getCashAudit(this.filters(from_date, to_date, undefined, undefined, center_id));
    }
};
exports.ReportsController = ReportsController;
__decorate([
    (0, common_1.Get)("sales"),
    (0, roles_decorator_1.Roles)(...user_role_enum_1.ERP_MANAGEMENT_ROLES),
    (0, swagger_1.ApiOperation)({ summary: "Sales report (legacy GET /reports/sales)" }),
    (0, swagger_1.ApiQuery)({ name: "from_date", required: false }),
    (0, swagger_1.ApiQuery)({ name: "to_date", required: false }),
    (0, swagger_1.ApiQuery)({ name: "sales_rep_id", required: false }),
    (0, swagger_1.ApiQuery)({ name: "customer_id", required: false }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)("from_date")),
    __param(1, (0, common_1.Query)("to_date")),
    __param(2, (0, common_1.Query)("sales_rep_id")),
    __param(3, (0, common_1.Query)("customer_id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "getSalesReport", null);
__decorate([
    (0, common_1.Get)("vehicles/:vehicle_id"),
    (0, roles_decorator_1.Roles)(...user_role_enum_1.ERP_MANAGEMENT_ROLES),
    (0, swagger_1.ApiOperation)({ summary: "Vehicle report" }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)("vehicle_id", common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)("from_date")),
    __param(2, (0, common_1.Query)("to_date")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "getVehicleReport", null);
__decorate([
    (0, common_1.Get)("centers/:center_id"),
    (0, roles_decorator_1.Roles)(...user_role_enum_1.ERP_MANAGEMENT_ROLES),
    (0, swagger_1.ApiOperation)({ summary: "Center report" }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)("center_id", common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)("from_date")),
    __param(2, (0, common_1.Query)("to_date")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "getCenterReport", null);
__decorate([
    (0, common_1.Get)("admin"),
    (0, roles_decorator_1.Roles)(...user_role_enum_1.ERP_MANAGEMENT_ROLES),
    (0, swagger_1.ApiOperation)({ summary: "Admin dashboard summary" }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)("from_date")),
    __param(1, (0, common_1.Query)("to_date")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "getAdminReport", null);
__decorate([
    (0, common_1.Get)("inventory"),
    (0, roles_decorator_1.Roles)(...user_role_enum_1.ERP_MANAGEMENT_ROLES),
    (0, swagger_1.ApiOperation)({ summary: "Inventory report" }),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "getInventoryReport", null);
__decorate([
    (0, common_1.Get)("centers-comparison"),
    (0, roles_decorator_1.Roles)(...user_role_enum_1.ERP_MANAGEMENT_ROLES),
    (0, swagger_1.ApiOperation)({ summary: "Centers comparison" }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)("from_date")),
    __param(1, (0, common_1.Query)("to_date")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "getCentersComparison", null);
__decorate([
    (0, common_1.Get)("cash-audit"),
    (0, roles_decorator_1.Roles)(...user_role_enum_1.ERP_MANAGEMENT_ROLES),
    (0, swagger_1.ApiOperation)({ summary: "Cash handover audit" }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)("from_date")),
    __param(1, (0, common_1.Query)("to_date")),
    __param(2, (0, common_1.Query)("center_id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "getCashAudit", null);
exports.ReportsController = ReportsController = __decorate([
    (0, swagger_1.ApiTags)("Reports"),
    (0, common_1.Controller)("reports"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [reports_service_1.ReportsService])
], ReportsController);
//# sourceMappingURL=reports.controller.js.map