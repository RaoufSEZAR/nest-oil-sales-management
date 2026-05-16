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
exports.UpdatePurchaseDto = exports.CreatePurchaseDistributionDto = exports.UpdateCashHandoverDto = exports.CreateCashHandoverDto = exports.UpdateInventoryTransferDto = exports.CreateInventoryTransferDto = exports.TransferLineDto = exports.CreateCurrencyExchangeDto = exports.CreatePurchaseDto = exports.PurchaseLineDto = exports.CreateExpenseDto = exports.UpdateVehicleTripDto = exports.CreateVehicleTripDto = exports.CreatePaymentDto = exports.CreateSalesReturnDto = exports.ReturnLineDto = exports.CreateInvoiceDto = exports.InvoiceLineDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const trade_currency_enum_1 = require("../enums/trade-currency.enum");
const sales_return_type_enum_1 = require("../enums/sales-return-type.enum");
const return_item_condition_enum_1 = require("../enums/return-item-condition.enum");
const trip_status_enum_1 = require("../enums/trip-status.enum");
const transfer_location_type_enum_1 = require("../enums/transfer-location-type.enum");
const transfer_status_enum_1 = require("../enums/transfer-status.enum");
const cash_handover_status_enum_1 = require("../enums/cash-handover-status.enum");
class InvoiceLineDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { productId: { required: true, type: () => Number }, quantity: { required: true, type: () => Number }, unitPrice: { required: true, type: () => Number } };
    }
}
exports.InvoiceLineDto = InvoiceLineDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], InvoiceLineDto.prototype, "productId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 4 }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], InvoiceLineDto.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], InvoiceLineDto.prototype, "unitPrice", void 0);
class CreateInvoiceDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { customerId: { required: true, type: () => Number }, salesRepId: { required: true, type: () => String, format: "uuid" }, date: { required: true, type: () => String }, items: { required: true, type: () => [require("./documents.dto").InvoiceLineDto] }, currency: { required: false, enum: require("../enums/trade-currency.enum").TradeCurrency }, exchangeRate: { required: false, type: () => Number }, discount: { required: false, type: () => Number }, taxRate: { required: false, type: () => Number }, tripId: { required: false, type: () => Number }, notes: { required: false, type: () => String } };
    }
}
exports.CreateInvoiceDto = CreateInvoiceDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateInvoiceDto.prototype, "customerId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateInvoiceDto.prototype, "salesRepId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateInvoiceDto.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [InvoiceLineDto] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => InvoiceLineDto),
    __metadata("design:type", Array)
], CreateInvoiceDto.prototype, "items", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: trade_currency_enum_1.TradeCurrency }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(trade_currency_enum_1.TradeCurrency),
    __metadata("design:type", String)
], CreateInvoiceDto.prototype, "currency", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 4 }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateInvoiceDto.prototype, "exchangeRate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateInvoiceDto.prototype, "discount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateInvoiceDto.prototype, "taxRate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateInvoiceDto.prototype, "tripId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateInvoiceDto.prototype, "notes", void 0);
class ReturnLineDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { productId: { required: true, type: () => Number }, quantity: { required: true, type: () => Number }, unitPrice: { required: true, type: () => Number }, condition: { required: false, enum: require("../enums/return-item-condition.enum").ReturnItemCondition }, reasonDetail: { required: false, type: () => String } };
    }
}
exports.ReturnLineDto = ReturnLineDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], ReturnLineDto.prototype, "productId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 4 }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], ReturnLineDto.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], ReturnLineDto.prototype, "unitPrice", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: return_item_condition_enum_1.ReturnItemCondition }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(return_item_condition_enum_1.ReturnItemCondition),
    __metadata("design:type", String)
], ReturnLineDto.prototype, "condition", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ReturnLineDto.prototype, "reasonDetail", void 0);
class CreateSalesReturnDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { returnType: { required: true, enum: require("../enums/sales-return-type.enum").SalesReturnType }, customerId: { required: true, type: () => Number }, salesRepId: { required: true, type: () => String, format: "uuid" }, date: { required: true, type: () => String }, items: { required: true, type: () => [require("./documents.dto").ReturnLineDto] }, originalInvoiceId: { required: false, type: () => Number }, reason: { required: false, type: () => String }, notes: { required: false, type: () => String } };
    }
}
exports.CreateSalesReturnDto = CreateSalesReturnDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: sales_return_type_enum_1.SalesReturnType }),
    (0, class_validator_1.IsEnum)(sales_return_type_enum_1.SalesReturnType),
    __metadata("design:type", String)
], CreateSalesReturnDto.prototype, "returnType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateSalesReturnDto.prototype, "customerId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateSalesReturnDto.prototype, "salesRepId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateSalesReturnDto.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [ReturnLineDto] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => ReturnLineDto),
    __metadata("design:type", Array)
], CreateSalesReturnDto.prototype, "items", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateSalesReturnDto.prototype, "originalInvoiceId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSalesReturnDto.prototype, "reason", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSalesReturnDto.prototype, "notes", void 0);
class CreatePaymentDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { customerId: { required: true, type: () => Number }, amount: { required: true, type: () => Number }, currency: { required: false, enum: require("../enums/trade-currency.enum").TradeCurrency }, exchangeRate: { required: false, type: () => Number }, paymentMethod: { required: false, type: () => String, maxLength: 20 }, paymentDate: { required: true, type: () => String }, receivedById: { required: true, type: () => String, format: "uuid" }, referenceNumber: { required: false, type: () => String }, notes: { required: false, type: () => String }, relatedInvoices: { required: false, type: () => Object } };
    }
}
exports.CreatePaymentDto = CreatePaymentDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreatePaymentDto.prototype, "customerId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 4 }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreatePaymentDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: trade_currency_enum_1.TradeCurrency }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(trade_currency_enum_1.TradeCurrency),
    __metadata("design:type", String)
], CreatePaymentDto.prototype, "currency", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 4 }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreatePaymentDto.prototype, "exchangeRate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(20),
    __metadata("design:type", String)
], CreatePaymentDto.prototype, "paymentMethod", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreatePaymentDto.prototype, "paymentDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreatePaymentDto.prototype, "receivedById", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePaymentDto.prototype, "referenceNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePaymentDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreatePaymentDto.prototype, "relatedInvoices", void 0);
class CreateVehicleTripDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { vehicleId: { required: true, type: () => Number }, salesRepId: { required: true, type: () => String, format: "uuid" }, tripDate: { required: true, type: () => String }, odometerStart: { required: true, type: () => Number }, odometerStartPhoto: { required: false, type: () => String }, notes: { required: false, type: () => String } };
    }
}
exports.CreateVehicleTripDto = CreateVehicleTripDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateVehicleTripDto.prototype, "vehicleId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateVehicleTripDto.prototype, "salesRepId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "2026-04-19" }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateVehicleTripDto.prototype, "tripDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateVehicleTripDto.prototype, "odometerStart", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateVehicleTripDto.prototype, "odometerStartPhoto", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateVehicleTripDto.prototype, "notes", void 0);
class UpdateVehicleTripDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { odometerEnd: { required: false, type: () => Number }, odometerEndPhoto: { required: false, type: () => String }, fuelCompensation: { required: false, type: () => Number }, notes: { required: false, type: () => String }, status: { required: false, enum: require("../enums/trip-status.enum").TripStatus }, endedAt: { required: false, type: () => String } };
    }
}
exports.UpdateVehicleTripDto = UpdateVehicleTripDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], UpdateVehicleTripDto.prototype, "odometerEnd", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateVehicleTripDto.prototype, "odometerEndPhoto", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], UpdateVehicleTripDto.prototype, "fuelCompensation", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateVehicleTripDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: trip_status_enum_1.TripStatus }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(trip_status_enum_1.TripStatus),
    __metadata("design:type", String)
], UpdateVehicleTripDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdateVehicleTripDto.prototype, "endedAt", void 0);
class CreateExpenseDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { centerId: { required: false, type: () => Number }, category: { required: true, type: () => String, maxLength: 50 }, description: { required: false, type: () => String }, amount: { required: true, type: () => Number }, currency: { required: false, enum: require("../enums/trade-currency.enum").TradeCurrency }, exchangeRate: { required: false, type: () => Number }, date: { required: true, type: () => String }, paidById: { required: true, type: () => String, format: "uuid" }, notes: { required: false, type: () => String } };
    }
}
exports.CreateExpenseDto = CreateExpenseDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateExpenseDto.prototype, "centerId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], CreateExpenseDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateExpenseDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 4 }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateExpenseDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: trade_currency_enum_1.TradeCurrency }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(trade_currency_enum_1.TradeCurrency),
    __metadata("design:type", String)
], CreateExpenseDto.prototype, "currency", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 4 }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateExpenseDto.prototype, "exchangeRate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "2026-04-19" }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateExpenseDto.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateExpenseDto.prototype, "paidById", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateExpenseDto.prototype, "notes", void 0);
class PurchaseLineDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { productId: { required: false, type: () => Number }, description: { required: false, type: () => String }, quantity: { required: true, type: () => Number }, unitPriceUsd: { required: true, type: () => Number } };
    }
}
exports.PurchaseLineDto = PurchaseLineDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], PurchaseLineDto.prototype, "productId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PurchaseLineDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 4 }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], PurchaseLineDto.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 4 }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], PurchaseLineDto.prototype, "unitPriceUsd", void 0);
class CreatePurchaseDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { centerId: { required: false, type: () => Number }, supplierName: { required: true, type: () => String, maxLength: 150 }, supplierPhone: { required: false, type: () => String, maxLength: 30 }, date: { required: true, type: () => String }, currency: { required: false, enum: require("../enums/trade-currency.enum").TradeCurrency }, exchangeRate: { required: false, type: () => Number }, createdById: { required: true, type: () => String, format: "uuid" }, items: { required: true, type: () => [require("./documents.dto").PurchaseLineDto] }, customsCost: { required: false, type: () => Number }, shippingCost: { required: false, type: () => Number }, notes: { required: false, type: () => String }, purchaseType: { required: false, type: () => String, maxLength: 20 }, paidAmount: { required: false, type: () => Number } };
    }
}
exports.CreatePurchaseDto = CreatePurchaseDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreatePurchaseDto.prototype, "centerId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(150),
    __metadata("design:type", String)
], CreatePurchaseDto.prototype, "supplierName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(30),
    __metadata("design:type", String)
], CreatePurchaseDto.prototype, "supplierPhone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "2026-04-19" }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreatePurchaseDto.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: trade_currency_enum_1.TradeCurrency }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(trade_currency_enum_1.TradeCurrency),
    __metadata("design:type", String)
], CreatePurchaseDto.prototype, "currency", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 4 }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreatePurchaseDto.prototype, "exchangeRate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreatePurchaseDto.prototype, "createdById", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [PurchaseLineDto] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => PurchaseLineDto),
    __metadata("design:type", Array)
], CreatePurchaseDto.prototype, "items", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 4 }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreatePurchaseDto.prototype, "customsCost", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 4 }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreatePurchaseDto.prototype, "shippingCost", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePurchaseDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: "main" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(20),
    __metadata("design:type", String)
], CreatePurchaseDto.prototype, "purchaseType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 4 }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreatePurchaseDto.prototype, "paidAmount", void 0);
class CreateCurrencyExchangeDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { centerId: { required: true, type: () => Number }, fromCurrency: { required: true, enum: require("../enums/trade-currency.enum").TradeCurrency }, fromAmount: { required: true, type: () => Number }, fromAmountUsd: { required: true, type: () => Number }, toCurrency: { required: true, enum: require("../enums/trade-currency.enum").TradeCurrency }, toAmount: { required: true, type: () => Number }, toAmountUsd: { required: true, type: () => Number }, exchangeRate: { required: true, type: () => Number }, fromWeightedRate: { required: false, type: () => Number }, toWeightedRate: { required: false, type: () => Number }, differenceUsd: { required: false, type: () => Number }, notes: { required: false, type: () => String }, createdById: { required: true, type: () => String, format: "uuid" } };
    }
}
exports.CreateCurrencyExchangeDto = CreateCurrencyExchangeDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateCurrencyExchangeDto.prototype, "centerId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: trade_currency_enum_1.TradeCurrency }),
    (0, class_validator_1.IsEnum)(trade_currency_enum_1.TradeCurrency),
    __metadata("design:type", String)
], CreateCurrencyExchangeDto.prototype, "fromCurrency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 4 }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateCurrencyExchangeDto.prototype, "fromAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 4 }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateCurrencyExchangeDto.prototype, "fromAmountUsd", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: trade_currency_enum_1.TradeCurrency }),
    (0, class_validator_1.IsEnum)(trade_currency_enum_1.TradeCurrency),
    __metadata("design:type", String)
], CreateCurrencyExchangeDto.prototype, "toCurrency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 4 }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateCurrencyExchangeDto.prototype, "toAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 4 }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateCurrencyExchangeDto.prototype, "toAmountUsd", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 4 }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateCurrencyExchangeDto.prototype, "exchangeRate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 4 }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateCurrencyExchangeDto.prototype, "fromWeightedRate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 4 }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateCurrencyExchangeDto.prototype, "toWeightedRate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 4 }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateCurrencyExchangeDto.prototype, "differenceUsd", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCurrencyExchangeDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateCurrencyExchangeDto.prototype, "createdById", void 0);
class TransferLineDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { productId: { required: true, type: () => Number }, quantity: { required: true, type: () => Number } };
    }
}
exports.TransferLineDto = TransferLineDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], TransferLineDto.prototype, "productId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 4 }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], TransferLineDto.prototype, "quantity", void 0);
class CreateInventoryTransferDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { fromLocationType: { required: true, enum: require("../enums/transfer-location-type.enum").TransferLocationType }, fromLocationId: { required: true, type: () => Number }, toLocationType: { required: true, enum: require("../enums/transfer-location-type.enum").TransferLocationType }, toLocationId: { required: true, type: () => Number }, date: { required: true, type: () => String }, transferredById: { required: false, type: () => String, format: "uuid" }, receivedById: { required: false, type: () => String, format: "uuid" }, status: { required: false, enum: require("../enums/transfer-status.enum").TransferStatus }, notes: { required: false, type: () => String }, items: { required: true, type: () => [require("./documents.dto").TransferLineDto] } };
    }
}
exports.CreateInventoryTransferDto = CreateInventoryTransferDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: transfer_location_type_enum_1.TransferLocationType }),
    (0, class_validator_1.IsEnum)(transfer_location_type_enum_1.TransferLocationType),
    __metadata("design:type", String)
], CreateInventoryTransferDto.prototype, "fromLocationType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateInventoryTransferDto.prototype, "fromLocationId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: transfer_location_type_enum_1.TransferLocationType }),
    (0, class_validator_1.IsEnum)(transfer_location_type_enum_1.TransferLocationType),
    __metadata("design:type", String)
], CreateInventoryTransferDto.prototype, "toLocationType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateInventoryTransferDto.prototype, "toLocationId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "2026-04-19" }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateInventoryTransferDto.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateInventoryTransferDto.prototype, "transferredById", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateInventoryTransferDto.prototype, "receivedById", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: transfer_status_enum_1.TransferStatus }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(transfer_status_enum_1.TransferStatus),
    __metadata("design:type", String)
], CreateInventoryTransferDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateInventoryTransferDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [TransferLineDto] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => TransferLineDto),
    __metadata("design:type", Array)
], CreateInventoryTransferDto.prototype, "items", void 0);
class UpdateInventoryTransferDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { status: { required: false, enum: require("../enums/transfer-status.enum").TransferStatus }, receivedById: { required: false, type: () => String, format: "uuid" }, completedAt: { required: false, type: () => String }, notes: { required: false, type: () => String } };
    }
}
exports.UpdateInventoryTransferDto = UpdateInventoryTransferDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: transfer_status_enum_1.TransferStatus }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(transfer_status_enum_1.TransferStatus),
    __metadata("design:type", String)
], UpdateInventoryTransferDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], UpdateInventoryTransferDto.prototype, "receivedById", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdateInventoryTransferDto.prototype, "completedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateInventoryTransferDto.prototype, "notes", void 0);
class CreateCashHandoverDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { fromType: { required: true, type: () => String, maxLength: 20 }, fromId: { required: true, type: () => Number }, toType: { required: true, type: () => String, maxLength: 20 }, toId: { required: true, type: () => Number }, amount: { required: true, type: () => Number }, originalCurrency: { required: false, type: () => String, maxLength: 10 }, originalAmount: { required: false, type: () => Number }, handoverDate: { required: true, type: () => String }, handedById: { required: true, type: () => String, format: "uuid" }, notes: { required: false, type: () => String } };
    }
}
exports.CreateCashHandoverDto = CreateCashHandoverDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(20),
    __metadata("design:type", String)
], CreateCashHandoverDto.prototype, "fromType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateCashHandoverDto.prototype, "fromId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(20),
    __metadata("design:type", String)
], CreateCashHandoverDto.prototype, "toType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateCashHandoverDto.prototype, "toId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 4 }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateCashHandoverDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(10),
    __metadata("design:type", String)
], CreateCashHandoverDto.prototype, "originalCurrency", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 4 }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateCashHandoverDto.prototype, "originalAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateCashHandoverDto.prototype, "handoverDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateCashHandoverDto.prototype, "handedById", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCashHandoverDto.prototype, "notes", void 0);
class UpdateCashHandoverDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { status: { required: false, enum: require("../enums/cash-handover-status.enum").CashHandoverStatus }, receivedById: { required: false, type: () => String, format: "uuid" }, confirmedAt: { required: false, type: () => String }, notes: { required: false, type: () => String } };
    }
}
exports.UpdateCashHandoverDto = UpdateCashHandoverDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: cash_handover_status_enum_1.CashHandoverStatus }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(cash_handover_status_enum_1.CashHandoverStatus),
    __metadata("design:type", String)
], UpdateCashHandoverDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], UpdateCashHandoverDto.prototype, "receivedById", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdateCashHandoverDto.prototype, "confirmedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateCashHandoverDto.prototype, "notes", void 0);
class CreatePurchaseDistributionDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { centerId: { required: true, type: () => Number }, productId: { required: true, type: () => Number }, quantity: { required: true, type: () => Number }, distributedById: { required: false, type: () => String, format: "uuid" }, notes: { required: false, type: () => String } };
    }
}
exports.CreatePurchaseDistributionDto = CreatePurchaseDistributionDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreatePurchaseDistributionDto.prototype, "centerId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreatePurchaseDistributionDto.prototype, "productId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 4 }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreatePurchaseDistributionDto.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreatePurchaseDistributionDto.prototype, "distributedById", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePurchaseDistributionDto.prototype, "notes", void 0);
class UpdatePurchaseDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { supplierName: { required: false, type: () => String, maxLength: 150 }, supplierPhone: { required: false, type: () => String, maxLength: 30 }, notes: { required: false, type: () => String } };
    }
}
exports.UpdatePurchaseDto = UpdatePurchaseDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(150),
    __metadata("design:type", String)
], UpdatePurchaseDto.prototype, "supplierName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(30),
    __metadata("design:type", String)
], UpdatePurchaseDto.prototype, "supplierPhone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdatePurchaseDto.prototype, "notes", void 0);
//# sourceMappingURL=documents.dto.js.map