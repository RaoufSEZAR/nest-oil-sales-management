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
exports.VehiclesController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const vehicles_service_1 = require("./vehicles.service");
const create_vehicle_dto_1 = require("./dto/create-vehicle.dto");
const update_vehicle_dto_1 = require("./dto/update-vehicle.dto");
const vehicle_entity_1 = require("./entities/vehicle.entity");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const user_role_enum_1 = require("../users/enums/user-role.enum");
const VEHICLE_READ_ROLES = [
    user_role_enum_1.UserRole.ADMIN,
    user_role_enum_1.UserRole.SUPER_ADMIN,
    user_role_enum_1.UserRole.MANAGER,
];
const VEHICLE_WRITE_ROLES = [
    user_role_enum_1.UserRole.ADMIN,
    user_role_enum_1.UserRole.SUPER_ADMIN,
    user_role_enum_1.UserRole.MANAGER,
];
let VehiclesController = class VehiclesController {
    constructor(vehiclesService) {
        this.vehiclesService = vehiclesService;
    }
    findAll(centerIdRaw, activeRaw) {
        const centerId = centerIdRaw !== undefined && centerIdRaw !== ""
            ? parseInt(centerIdRaw, 10)
            : undefined;
        let active;
        if (activeRaw === "true")
            active = true;
        else if (activeRaw === "false")
            active = false;
        return this.vehiclesService.findAll({
            centerId: Number.isFinite(centerId) ? centerId : undefined,
            active,
        });
    }
    findOne(id) {
        return this.vehiclesService.findOne(id);
    }
    create(dto) {
        return this.vehiclesService.create(dto);
    }
    updatePut(id, dto) {
        return this.vehiclesService.update(id, dto);
    }
    update(id, dto) {
        return this.vehiclesService.update(id, dto);
    }
};
exports.VehiclesController = VehiclesController;
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(...VEHICLE_READ_ROLES),
    (0, swagger_1.ApiOperation)({
        summary: "List vehicles (legacy GET /vehicles with center_id, active filters)",
    }),
    (0, swagger_1.ApiQuery)({ name: "center_id", type: Number, required: false }),
    (0, swagger_1.ApiQuery)({ name: "active", type: Boolean, required: false }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Vehicles list", type: [vehicle_entity_1.Vehicle] }),
    openapi.ApiResponse({ status: 200, type: [require("./entities/vehicle.entity").Vehicle] }),
    __param(0, (0, common_1.Query)("center_id")),
    __param(1, (0, common_1.Query)("active")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], VehiclesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(":id"),
    (0, roles_decorator_1.Roles)(...VEHICLE_READ_ROLES),
    (0, swagger_1.ApiOperation)({
        summary: "Get vehicle by id with center, sales rep, and last 10 trips (legacy GET /vehicles/:id)",
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Vehicle found", type: vehicle_entity_1.Vehicle }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Vehicle not found" }),
    openapi.ApiResponse({ status: 200, type: require("./entities/vehicle.entity").Vehicle }),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], VehiclesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(...VEHICLE_WRITE_ROLES),
    (0, swagger_1.ApiOperation)({ summary: "Create vehicle (legacy POST /vehicles)" }),
    (0, swagger_1.ApiResponse)({ status: 201, description: "Vehicle created", type: vehicle_entity_1.Vehicle }),
    (0, swagger_1.ApiResponse)({ status: 409, description: "Vehicle code already exists" }),
    openapi.ApiResponse({ status: 201, type: require("./entities/vehicle.entity").Vehicle }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_vehicle_dto_1.CreateVehicleDto]),
    __metadata("design:returntype", void 0)
], VehiclesController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(":id"),
    (0, roles_decorator_1.Roles)(...VEHICLE_WRITE_ROLES),
    (0, swagger_1.ApiOperation)({ summary: "Update vehicle (legacy PUT /vehicles/:id)" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Vehicle updated", type: vehicle_entity_1.Vehicle }),
    openapi.ApiResponse({ status: 200, type: require("./entities/vehicle.entity").Vehicle }),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_vehicle_dto_1.UpdateVehicleDto]),
    __metadata("design:returntype", void 0)
], VehiclesController.prototype, "updatePut", null);
__decorate([
    (0, common_1.Patch)(":id"),
    (0, roles_decorator_1.Roles)(...VEHICLE_WRITE_ROLES),
    (0, swagger_1.ApiOperation)({ summary: "Update vehicle (partial)" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Vehicle updated", type: vehicle_entity_1.Vehicle }),
    openapi.ApiResponse({ status: 200, type: require("./entities/vehicle.entity").Vehicle }),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_vehicle_dto_1.UpdateVehicleDto]),
    __metadata("design:returntype", void 0)
], VehiclesController.prototype, "update", null);
exports.VehiclesController = VehiclesController = __decorate([
    (0, swagger_1.ApiTags)("Vehicles"),
    (0, common_1.Controller)("vehicles"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [vehicles_service_1.VehiclesService])
], VehiclesController);
//# sourceMappingURL=vehicles.controller.js.map