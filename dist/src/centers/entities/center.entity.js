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
exports.Center = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const user_entity_1 = require("../../users/entities/user.entity");
const vehicle_entity_1 = require("../../vehicles/entities/vehicle.entity");
const center_type_enum_1 = require("../enums/center-type.enum");
let Center = class Center {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => Number }, name: { required: true, type: () => String }, code: { required: true, type: () => String }, centerType: { required: true, enum: require("../enums/center-type.enum").CenterType }, isIndependent: { required: true, type: () => Boolean }, address: { required: false, type: () => String, nullable: true }, managerId: { required: false, type: () => String, nullable: true }, manager: { required: false, type: () => require("../../users/entities/user.entity").User, nullable: true }, parentCenterId: { required: false, type: () => Number, nullable: true }, parentCenter: { required: false, type: () => require("./center.entity").Center, nullable: true }, branches: { required: true, type: () => [require("./center.entity").Center] }, vehicles: { required: true, type: () => [require("../../vehicles/entities/vehicle.entity").Vehicle] }, users: { required: true, type: () => [require("../../users/entities/user.entity").User] }, active: { required: true, type: () => Boolean }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date } };
    }
};
exports.Center = Center;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Center.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Center display name" }),
    (0, typeorm_1.Column)({ type: "varchar", length: 100 }),
    __metadata("design:type", String)
], Center.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Unique center code" }),
    (0, typeorm_1.Column)({ type: "varchar", length: 20, unique: true }),
    __metadata("design:type", String)
], Center.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: center_type_enum_1.CenterType }),
    (0, typeorm_1.Column)({
        name: "center_type",
        type: "enum",
        enum: center_type_enum_1.CenterType,
        default: center_type_enum_1.CenterType.BRANCH,
    }),
    __metadata("design:type", String)
], Center.prototype, "centerType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Independent agent vs company-owned (legacy is_independent)",
    }),
    (0, typeorm_1.Column)({ name: "is_independent", default: false }),
    __metadata("design:type", Boolean)
], Center.prototype, "isIndependent", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], Center.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, description: "Manager user UUID" }),
    (0, typeorm_1.Column)({ name: "manager_id", type: "uuid", nullable: true }),
    __metadata("design:type", String)
], Center.prototype, "managerId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true, eager: false }),
    (0, typeorm_1.JoinColumn)({ name: "manager_id" }),
    __metadata("design:type", user_entity_1.User)
], Center.prototype, "manager", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, typeorm_1.Column)({ name: "parent_center_id", type: "int", nullable: true }),
    __metadata("design:type", Number)
], Center.prototype, "parentCenterId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Center, (c) => c.branches, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: "parent_center_id" }),
    __metadata("design:type", Center)
], Center.prototype, "parentCenter", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Center, (c) => c.parentCenter),
    __metadata("design:type", Array)
], Center.prototype, "branches", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => vehicle_entity_1.Vehicle, (v) => v.center),
    __metadata("design:type", Array)
], Center.prototype, "vehicles", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => user_entity_1.User, (u) => u.center),
    __metadata("design:type", Array)
], Center.prototype, "users", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Center.prototype, "active", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: "created_at" }),
    __metadata("design:type", Date)
], Center.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: "updated_at" }),
    __metadata("design:type", Date)
], Center.prototype, "updatedAt", void 0);
exports.Center = Center = __decorate([
    (0, typeorm_1.Entity)("centers")
], Center);
//# sourceMappingURL=center.entity.js.map