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
exports.UpdateHrSettingsDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class UpdateHrSettingsDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { base_salary: { required: false, type: () => Number, minimum: 0 }, commission_rate: { required: false, type: () => Number, minimum: 0 }, commission_basis: { required: false, type: () => Object, enum: ["sales", "cash"] } };
    }
}
exports.UpdateHrSettingsDto = UpdateHrSettingsDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdateHrSettingsDto.prototype, "base_salary", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdateHrSettingsDto.prototype, "commission_rate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: ["sales", "cash"] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(["sales", "cash"]),
    __metadata("design:type", String)
], UpdateHrSettingsDto.prototype, "commission_basis", void 0);
//# sourceMappingURL=update-hr-settings.dto.js.map