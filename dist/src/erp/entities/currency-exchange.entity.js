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
exports.CurrencyExchange = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const center_entity_1 = require("../../centers/entities/center.entity");
const user_entity_1 = require("../../users/entities/user.entity");
const trade_currency_enum_1 = require("../enums/trade-currency.enum");
let CurrencyExchange = class CurrencyExchange {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => Number }, exchangeNumber: { required: true, type: () => String }, center: { required: true, type: () => require("../../centers/entities/center.entity").Center }, fromCurrency: { required: true, enum: require("../enums/trade-currency.enum").TradeCurrency }, fromAmount: { required: true, type: () => String }, fromAmountUsd: { required: true, type: () => String }, toCurrency: { required: true, enum: require("../enums/trade-currency.enum").TradeCurrency }, toAmount: { required: true, type: () => String }, toAmountUsd: { required: true, type: () => String }, exchangeRate: { required: true, type: () => String }, fromWeightedRate: { required: true, type: () => String }, toWeightedRate: { required: true, type: () => String }, differenceUsd: { required: true, type: () => String }, notes: { required: false, type: () => String, nullable: true }, createdBy: { required: true, type: () => require("../../users/entities/user.entity").User }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date } };
    }
};
exports.CurrencyExchange = CurrencyExchange;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], CurrencyExchange.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "exchange_number", type: "varchar", length: 50, unique: true }),
    __metadata("design:type", String)
], CurrencyExchange.prototype, "exchangeNumber", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => center_entity_1.Center),
    (0, typeorm_1.JoinColumn)({ name: "center_id" }),
    __metadata("design:type", center_entity_1.Center)
], CurrencyExchange.prototype, "center", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "from_currency", type: "enum", enum: trade_currency_enum_1.TradeCurrency }),
    __metadata("design:type", String)
], CurrencyExchange.prototype, "fromCurrency", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "from_amount", type: "decimal", precision: 15, scale: 4 }),
    __metadata("design:type", String)
], CurrencyExchange.prototype, "fromAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "from_amount_usd", type: "decimal", precision: 15, scale: 4 }),
    __metadata("design:type", String)
], CurrencyExchange.prototype, "fromAmountUsd", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "to_currency", type: "enum", enum: trade_currency_enum_1.TradeCurrency }),
    __metadata("design:type", String)
], CurrencyExchange.prototype, "toCurrency", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "to_amount", type: "decimal", precision: 15, scale: 4 }),
    __metadata("design:type", String)
], CurrencyExchange.prototype, "toAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "to_amount_usd", type: "decimal", precision: 15, scale: 4 }),
    __metadata("design:type", String)
], CurrencyExchange.prototype, "toAmountUsd", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "exchange_rate", type: "decimal", precision: 12, scale: 4 }),
    __metadata("design:type", String)
], CurrencyExchange.prototype, "exchangeRate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "from_weighted_rate", type: "decimal", precision: 12, scale: 4, default: 1 }),
    __metadata("design:type", String)
], CurrencyExchange.prototype, "fromWeightedRate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "to_weighted_rate", type: "decimal", precision: 12, scale: 4, default: 1 }),
    __metadata("design:type", String)
], CurrencyExchange.prototype, "toWeightedRate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "difference_usd", type: "decimal", precision: 15, scale: 4, default: 0 }),
    __metadata("design:type", String)
], CurrencyExchange.prototype, "differenceUsd", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], CurrencyExchange.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: "created_by" }),
    __metadata("design:type", user_entity_1.User)
], CurrencyExchange.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: "created_at" }),
    __metadata("design:type", Date)
], CurrencyExchange.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: "updated_at" }),
    __metadata("design:type", Date)
], CurrencyExchange.prototype, "updatedAt", void 0);
exports.CurrencyExchange = CurrencyExchange = __decorate([
    (0, typeorm_1.Entity)("currency_exchanges")
], CurrencyExchange);
//# sourceMappingURL=currency-exchange.entity.js.map