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
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehicleTrip = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const vehicle_entity_1 = require("../../vehicles/entities/vehicle.entity");
const user_entity_1 = require("../../users/entities/user.entity");
const trip_status_enum_1 = require("../enums/trip-status.enum");
let VehicleTrip = class VehicleTrip {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => Number }, tripNumber: { required: true, type: () => String }, vehicle: { required: true, type: () => require("../../vehicles/entities/vehicle.entity").Vehicle }, salesRep: { required: true, type: () => require("../../users/entities/user.entity").User }, tripDate: { required: true, type: () => String }, odometerStart: { required: true, type: () => Number }, odometerStartPhoto: { required: false, type: () => String, nullable: true }, odometerEnd: { required: false, type: () => Number, nullable: true }, odometerEndPhoto: { required: false, type: () => String, nullable: true }, distanceKm: { required: false, type: () => Number, nullable: true }, fuelCompensation: { required: false, type: () => String, nullable: true }, notes: { required: false, type: () => String, nullable: true }, status: { required: true, enum: require("../enums/trip-status.enum").TripStatus }, startedAt: { required: true, type: () => Date }, endedAt: { required: false, type: () => Date, nullable: true }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date } };
    }
};
exports.VehicleTrip = VehicleTrip;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], VehicleTrip.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "trip_number", type: "varchar", length: 50, unique: true }),
    __metadata("design:type", String)
], VehicleTrip.prototype, "tripNumber", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => vehicle_entity_1.Vehicle, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: "vehicle_id" }),
    __metadata("design:type", vehicle_entity_1.Vehicle)
], VehicleTrip.prototype, "vehicle", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: "sales_rep_id" }),
    __metadata("design:type", user_entity_1.User)
], VehicleTrip.prototype, "salesRep", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "trip_date", type: "date" }),
    __metadata("design:type", String)
], VehicleTrip.prototype, "tripDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "odometer_start", type: "int" }),
    __metadata("design:type", Number)
], VehicleTrip.prototype, "odometerStart", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "odometer_start_photo", type: "text", nullable: true }),
    __metadata("design:type", String)
], VehicleTrip.prototype, "odometerStartPhoto", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "odometer_end", type: "int", nullable: true }),
    __metadata("design:type", Number)
], VehicleTrip.prototype, "odometerEnd", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "odometer_end_photo", type: "text", nullable: true }),
    __metadata("design:type", String)
], VehicleTrip.prototype, "odometerEndPhoto", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "distance_km", type: "int", nullable: true }),
    __metadata("design:type", Number)
], VehicleTrip.prototype, "distanceKm", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "fuel_compensation", type: "decimal", precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", String)
], VehicleTrip.prototype, "fuelCompensation", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], VehicleTrip.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "enum",
        enum: trip_status_enum_1.TripStatus,
        default: trip_status_enum_1.TripStatus.ACTIVE,
    }),
    __metadata("design:type", String)
], VehicleTrip.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "started_at", type: "timestamp" }),
    __metadata("design:type", Date)
], VehicleTrip.prototype, "startedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "ended_at", type: "timestamp", nullable: true }),
    __metadata("design:type", Date)
], VehicleTrip.prototype, "endedAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: "created_at" }),
    __metadata("design:type", Date)
], VehicleTrip.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: "updated_at" }),
    __metadata("design:type", Date)
], VehicleTrip.prototype, "updatedAt", void 0);
exports.VehicleTrip = VehicleTrip = __decorate([
    (0, typeorm_1.Entity)("vehicle_trips")
], VehicleTrip);
//# sourceMappingURL=vehicle-trip.entity.js.map