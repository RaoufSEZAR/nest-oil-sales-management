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
exports.ErpVehicleTripsController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const user_role_enum_1 = require("../users/enums/user-role.enum");
const vehicle_trips_service_1 = require("./vehicle-trips.service");
const documents_dto_1 = require("./dto/documents.dto");
const api_tags_1 = require("../swagger/api-tags");
let ErpVehicleTripsController = class ErpVehicleTripsController {
    constructor(trips) {
        this.trips = trips;
    }
    findAll() {
        return this.trips.findAll();
    }
    findOne(id) {
        return this.trips.findOne(id);
    }
    create(dto) {
        return this.trips.create(dto);
    }
    update(id, dto) {
        return this.trips.update(id, dto);
    }
};
exports.ErpVehicleTripsController = ErpVehicleTripsController;
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.SUPER_ADMIN, user_role_enum_1.UserRole.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: "List vehicle trips" }),
    openapi.ApiResponse({ status: 200, type: [require("./entities/vehicle-trip.entity").VehicleTrip] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ErpVehicleTripsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(":id"),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.SUPER_ADMIN, user_role_enum_1.UserRole.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: "Get trip by id" }),
    openapi.ApiResponse({ status: 200, type: require("./entities/vehicle-trip.entity").VehicleTrip }),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ErpVehicleTripsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: "Start a vehicle trip" }),
    openapi.ApiResponse({ status: 201, type: require("./entities/vehicle-trip.entity").VehicleTrip }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [documents_dto_1.CreateVehicleTripDto]),
    __metadata("design:returntype", void 0)
], ErpVehicleTripsController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(":id"),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: "Update trip (odometer end, status, etc.)" }),
    openapi.ApiResponse({ status: 200, type: require("./entities/vehicle-trip.entity").VehicleTrip }),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, documents_dto_1.UpdateVehicleTripDto]),
    __metadata("design:returntype", void 0)
], ErpVehicleTripsController.prototype, "update", null);
exports.ErpVehicleTripsController = ErpVehicleTripsController = __decorate([
    (0, swagger_1.ApiTags)(api_tags_1.SwaggerTags.ErpVehicleTrips),
    (0, common_1.Controller)("vehicle-trips"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [vehicle_trips_service_1.ErpVehicleTripsService])
], ErpVehicleTripsController);
//# sourceMappingURL=vehicle-trips.controller.js.map