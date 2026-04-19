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
exports.Vehicle = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const center_entity_1 = require("../../centers/entities/center.entity");
const user_entity_1 = require("../../users/entities/user.entity");
let Vehicle = class Vehicle {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => Number }, name: { required: true, type: () => String }, code: { required: true, type: () => String }, licensePlate: { required: false, type: () => String, nullable: true }, centerId: { required: true, type: () => Number }, center: { required: true, type: () => require("../../centers/entities/center.entity").Center }, currentSalesRepId: { required: false, type: () => String, nullable: true }, currentSalesRep: { required: false, type: () => require("../../users/entities/user.entity").User, nullable: true }, vehicleType: { required: false, type: () => String, nullable: true }, active: { required: true, type: () => Boolean }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date } };
    }
};
exports.Vehicle = Vehicle;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Vehicle.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ type: "varchar", length: 100 }),
    __metadata("design:type", String)
], Vehicle.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ type: "varchar", length: 20, unique: true }),
    __metadata("design:type", String)
], Vehicle.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, typeorm_1.Column)({ name: "license_plate", type: "varchar", length: 20, nullable: true }),
    __metadata("design:type", String)
], Vehicle.prototype, "licensePlate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ name: "center_id", type: "int" }),
    __metadata("design:type", Number)
], Vehicle.prototype, "centerId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => center_entity_1.Center, (c) => c.vehicles, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: "center_id" }),
    __metadata("design:type", center_entity_1.Center)
], Vehicle.prototype, "center", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, typeorm_1.Column)({ name: "current_sales_rep_id", type: "uuid", nullable: true }),
    __metadata("design:type", String)
], Vehicle.prototype, "currentSalesRepId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: "current_sales_rep_id" }),
    __metadata("design:type", user_entity_1.User)
], Vehicle.prototype, "currentSalesRep", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, typeorm_1.Column)({ name: "vehicle_type", type: "varchar", length: 50, nullable: true }),
    __metadata("design:type", String)
], Vehicle.prototype, "vehicleType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Vehicle.prototype, "active", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: "created_at" }),
    __metadata("design:type", Date)
], Vehicle.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: "updated_at" }),
    __metadata("design:type", Date)
], Vehicle.prototype, "updatedAt", void 0);
exports.Vehicle = Vehicle = __decorate([
    (0, typeorm_1.Entity)("vehicles")
], Vehicle);
//# sourceMappingURL=vehicle.entity.js.map