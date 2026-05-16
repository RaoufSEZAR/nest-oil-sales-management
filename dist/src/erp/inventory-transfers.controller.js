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
exports.ErpInventoryTransfersController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const user_role_enum_1 = require("../users/enums/user-role.enum");
const inventory_transfers_service_1 = require("./inventory-transfers.service");
const documents_dto_1 = require("./dto/documents.dto");
const api_tags_1 = require("../swagger/api-tags");
let ErpInventoryTransfersController = class ErpInventoryTransfersController {
    constructor(transfers) {
        this.transfers = transfers;
    }
    findAll() {
        return this.transfers.findAll();
    }
    findOne(id) {
        return this.transfers.findOne(id);
    }
    create(dto) {
        return this.transfers.create(dto);
    }
    update(id, dto) {
        return this.transfers.update(id, dto);
    }
};
exports.ErpInventoryTransfersController = ErpInventoryTransfersController;
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.SUPER_ADMIN, user_role_enum_1.UserRole.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: "List inventory transfers" }),
    openapi.ApiResponse({ status: 200, type: [require("./entities/inventory-transfer.entity").InventoryTransfer] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ErpInventoryTransfersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(":id"),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.SUPER_ADMIN, user_role_enum_1.UserRole.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: "Get transfer by id" }),
    openapi.ApiResponse({ status: 200, type: require("./entities/inventory-transfer.entity").InventoryTransfer }),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ErpInventoryTransfersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: "Create transfer with line items" }),
    openapi.ApiResponse({ status: 201, type: require("./entities/inventory-transfer.entity").InventoryTransfer }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [documents_dto_1.CreateInventoryTransferDto]),
    __metadata("design:returntype", void 0)
], ErpInventoryTransfersController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(":id"),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: "Update transfer status / receiver" }),
    openapi.ApiResponse({ status: 200, type: require("./entities/inventory-transfer.entity").InventoryTransfer }),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, documents_dto_1.UpdateInventoryTransferDto]),
    __metadata("design:returntype", void 0)
], ErpInventoryTransfersController.prototype, "update", null);
exports.ErpInventoryTransfersController = ErpInventoryTransfersController = __decorate([
    (0, swagger_1.ApiTags)(api_tags_1.SwaggerTags.ErpInventoryTransfers),
    (0, common_1.Controller)("inventory-transfers"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [inventory_transfers_service_1.ErpInventoryTransfersService])
], ErpInventoryTransfersController);
//# sourceMappingURL=inventory-transfers.controller.js.map