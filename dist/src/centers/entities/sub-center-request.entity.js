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
exports.SubCenterRequest = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const user_entity_1 = require("../../users/entities/user.entity");
const center_entity_1 = require("./center.entity");
const sub_center_request_status_enum_1 = require("../enums/sub-center-request-status.enum");
let SubCenterRequest = class SubCenterRequest {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => Number }, requestedName: { required: true, type: () => String }, location: { required: false, type: () => String, nullable: true }, notes: { required: false, type: () => String, nullable: true }, requestedByUserId: { required: true, type: () => String }, requestedByUser: { required: false, type: () => require("../../users/entities/user.entity").User }, requestedFromCenterId: { required: false, type: () => Number, nullable: true }, requestedFromCenter: { required: false, type: () => require("./center.entity").Center, nullable: true }, status: { required: true, enum: require("../enums/sub-center-request-status.enum").SubCenterRequestStatus }, createdAt: { required: true, type: () => Date } };
    }
};
exports.SubCenterRequest = SubCenterRequest;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], SubCenterRequest.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Requested display name for the new branch" }),
    (0, typeorm_1.Column)({ name: "requested_name", type: "varchar", length: 200 }),
    __metadata("design:type", String)
], SubCenterRequest.prototype, "requestedName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, typeorm_1.Column)({ type: "varchar", length: 500, nullable: true }),
    __metadata("design:type", String)
], SubCenterRequest.prototype, "location", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], SubCenterRequest.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "User who submitted the request" }),
    (0, typeorm_1.Column)({ name: "requested_by_user_id", type: "uuid" }),
    __metadata("design:type", String)
], SubCenterRequest.prototype, "requestedByUserId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: false }),
    (0, typeorm_1.JoinColumn)({ name: "requested_by_user_id" }),
    __metadata("design:type", user_entity_1.User)
], SubCenterRequest.prototype, "requestedByUser", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: "Submitting user's center at time of request",
    }),
    (0, typeorm_1.Column)({ name: "requested_from_center_id", type: "int", nullable: true }),
    __metadata("design:type", Number)
], SubCenterRequest.prototype, "requestedFromCenterId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => center_entity_1.Center, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: "requested_from_center_id" }),
    __metadata("design:type", center_entity_1.Center)
], SubCenterRequest.prototype, "requestedFromCenter", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: sub_center_request_status_enum_1.SubCenterRequestStatus }),
    (0, typeorm_1.Column)({
        type: "enum",
        enum: sub_center_request_status_enum_1.SubCenterRequestStatus,
        default: sub_center_request_status_enum_1.SubCenterRequestStatus.PENDING,
    }),
    __metadata("design:type", String)
], SubCenterRequest.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.CreateDateColumn)({ name: "created_at" }),
    __metadata("design:type", Date)
], SubCenterRequest.prototype, "createdAt", void 0);
exports.SubCenterRequest = SubCenterRequest = __decorate([
    (0, typeorm_1.Entity)("sub_center_requests")
], SubCenterRequest);
//# sourceMappingURL=sub-center-request.entity.js.map