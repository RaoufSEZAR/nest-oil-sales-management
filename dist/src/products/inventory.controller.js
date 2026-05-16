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
exports.InventoryController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const user_role_enum_1 = require("../users/enums/user-role.enum");
const inventory_service_1 = require("./inventory.service");
const inventory_location_type_enum_1 = require("./enums/inventory-location-type.enum");
const query_filters_1 = require("../common/utils/query-filters");
const users_service_1 = require("../users/users.service");
let InventoryController = class InventoryController {
    constructor(inventory, usersService) {
        this.inventory = inventory;
        this.usersService = usersService;
    }
    async getInventory(locationType, locationIdRaw, req) {
        let locationId = (0, query_filters_1.parseOptionalInt)(locationIdRaw);
        let type = locationType;
        if (req?.user.role === user_role_enum_1.UserRole.USER) {
            const user = await this.usersService.findOne(req.user.userId);
            type = inventory_location_type_enum_1.InventoryLocationType.VEHICLE;
            locationId = user.vehicleId ?? locationId;
        }
        return this.inventory.findByLocation({
            locationType: type,
            locationId,
        });
    }
    getLowStockAlerts(thresholdRaw) {
        const threshold = thresholdRaw ? parseInt(thresholdRaw, 10) : 10;
        return this.inventory.getLowStockAlerts(Number.isFinite(threshold) ? threshold : 10);
    }
    getProductInventory(productId) {
        return this.inventory.findByProduct(productId);
    }
    updateInventory(productId, body) {
        return this.inventory.updateQuantity(productId, body.location_type, body.location_id, body.quantity);
    }
};
exports.InventoryController = InventoryController;
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(...user_role_enum_1.ERP_MANAGEMENT_ROLES, user_role_enum_1.UserRole.USER),
    (0, swagger_1.ApiOperation)({ summary: "Inventory by location (legacy GET /inventory)" }),
    (0, swagger_1.ApiQuery)({ name: "location_type", required: false, enum: inventory_location_type_enum_1.InventoryLocationType }),
    (0, swagger_1.ApiQuery)({ name: "location_id", required: false, type: Number }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)("location_type")),
    __param(1, (0, common_1.Query)("location_id")),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "getInventory", null);
__decorate([
    (0, common_1.Get)("alerts/low-stock"),
    (0, roles_decorator_1.Roles)(...user_role_enum_1.ERP_MANAGEMENT_ROLES),
    (0, swagger_1.ApiOperation)({ summary: "Low stock alerts (legacy GET /inventory/alerts)" }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)("threshold")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "getLowStockAlerts", null);
__decorate([
    (0, common_1.Get)("product/:product_id"),
    (0, roles_decorator_1.Roles)(...user_role_enum_1.ERP_MANAGEMENT_ROLES),
    (0, swagger_1.ApiOperation)({ summary: "Product inventory across locations" }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)("product_id", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "getProductInventory", null);
__decorate([
    (0, common_1.Patch)("product/:product_id"),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: "Update inventory quantity at a location" }),
    openapi.ApiResponse({ status: 200, type: require("./entities/product.entity").Inventory }),
    __param(0, (0, common_1.Param)("product_id", common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "updateInventory", null);
exports.InventoryController = InventoryController = __decorate([
    (0, swagger_1.ApiTags)("Inventory"),
    (0, common_1.Controller)("inventory"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [inventory_service_1.InventoryService,
        users_service_1.UsersService])
], InventoryController);
//# sourceMappingURL=inventory.controller.js.map