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
exports.BulkUpsertProductsResultDto = exports.BulkUpsertProductErrorDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
class BulkUpsertProductErrorDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { sku: { required: true, type: () => String }, message: { required: true, type: () => String } };
    }
}
exports.BulkUpsertProductErrorDto = BulkUpsertProductErrorDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], BulkUpsertProductErrorDto.prototype, "sku", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], BulkUpsertProductErrorDto.prototype, "message", void 0);
class BulkUpsertProductsResultDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { created: { required: true, type: () => Number }, updated: { required: true, type: () => Number }, skipped: { required: true, type: () => Number }, total: { required: true, type: () => Number }, errors: { required: true, type: () => [require("./bulk-upsert-result.dto").BulkUpsertProductErrorDto] } };
    }
}
exports.BulkUpsertProductsResultDto = BulkUpsertProductsResultDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], BulkUpsertProductsResultDto.prototype, "created", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], BulkUpsertProductsResultDto.prototype, "updated", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], BulkUpsertProductsResultDto.prototype, "skipped", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], BulkUpsertProductsResultDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [BulkUpsertProductErrorDto] }),
    __metadata("design:type", Array)
], BulkUpsertProductsResultDto.prototype, "errors", void 0);
//# sourceMappingURL=bulk-upsert-result.dto.js.map