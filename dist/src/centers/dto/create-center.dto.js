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
exports.CreateCenterDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const center_type_enum_1 = require("../enums/center-type.enum");
class CreateCenterDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { name: { required: true, type: () => String, minLength: 1, maxLength: 100 }, code: { required: true, type: () => String, minLength: 1, maxLength: 20 }, centerType: { required: false, enum: require("../enums/center-type.enum").CenterType }, isIndependent: { required: false, type: () => Boolean }, address: { required: false, type: () => String }, managerId: { required: false, type: () => String, format: "uuid" }, parentCenterId: { required: false, type: () => Number } };
    }
}
exports.CreateCenterDto = CreateCenterDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Main depot" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateCenterDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "CENTER-001" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    (0, class_validator_1.MaxLength)(20),
    __metadata("design:type", String)
], CreateCenterDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: center_type_enum_1.CenterType, default: center_type_enum_1.CenterType.BRANCH }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(center_type_enum_1.CenterType),
    __metadata("design:type", String)
], CreateCenterDto.prototype, "centerType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateCenterDto.prototype, "isIndependent", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCenterDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateCenterDto.prototype, "managerId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateCenterDto.prototype, "parentCenterId", void 0);
//# sourceMappingURL=create-center.dto.js.map