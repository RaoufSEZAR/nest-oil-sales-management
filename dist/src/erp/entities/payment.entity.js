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
exports.Payment = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const customer_entity_1 = require("./customer.entity");
const user_entity_1 = require("../../users/entities/user.entity");
const trade_currency_enum_1 = require("../enums/trade-currency.enum");
let Payment = class Payment {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => Number }, paymentNumber: { required: true, type: () => String }, customer: { required: true, type: () => require("./customer.entity").Customer }, amount: { required: true, type: () => String }, currency: { required: true, enum: require("../enums/trade-currency.enum").TradeCurrency }, exchangeRate: { required: true, type: () => String }, amountUsd: { required: false, type: () => String, nullable: true }, paymentMethod: { required: true, type: () => String }, paymentDate: { required: true, type: () => Date }, receivedBy: { required: true, type: () => require("../../users/entities/user.entity").User }, referenceNumber: { required: false, type: () => String, nullable: true }, notes: { required: false, type: () => String, nullable: true }, relatedInvoices: { required: false, type: () => Object, nullable: true }, editedOnce: { required: true, type: () => Boolean }, lastEditAllowedUntil: { required: false, type: () => Date, nullable: true }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date } };
    }
};
exports.Payment = Payment;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Payment.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "payment_number", type: "varchar", length: 50, unique: true }),
    __metadata("design:type", String)
], Payment.prototype, "paymentNumber", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => customer_entity_1.Customer),
    (0, typeorm_1.JoinColumn)({ name: "customer_id" }),
    __metadata("design:type", customer_entity_1.Customer)
], Payment.prototype, "customer", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "decimal", precision: 15, scale: 4 }),
    __metadata("design:type", String)
], Payment.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "enum",
        enum: trade_currency_enum_1.TradeCurrency,
        default: trade_currency_enum_1.TradeCurrency.USD,
    }),
    __metadata("design:type", String)
], Payment.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "exchange_rate", type: "decimal", precision: 10, scale: 2, default: 1 }),
    __metadata("design:type", String)
], Payment.prototype, "exchangeRate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "amount_usd", type: "decimal", precision: 15, scale: 4, nullable: true }),
    __metadata("design:type", String)
], Payment.prototype, "amountUsd", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "payment_method", type: "varchar", length: 20, default: "نقدي" }),
    __metadata("design:type", String)
], Payment.prototype, "paymentMethod", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "payment_date", type: "timestamp" }),
    __metadata("design:type", Date)
], Payment.prototype, "paymentDate", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: "received_by" }),
    __metadata("design:type", user_entity_1.User)
], Payment.prototype, "receivedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "reference_number", type: "varchar", length: 100, nullable: true }),
    __metadata("design:type", String)
], Payment.prototype, "referenceNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], Payment.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "related_invoices", type: "jsonb", nullable: true }),
    __metadata("design:type", Object)
], Payment.prototype, "relatedInvoices", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "edited_once", default: false }),
    __metadata("design:type", Boolean)
], Payment.prototype, "editedOnce", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "last_edit_allowed_until", type: "timestamp", nullable: true }),
    __metadata("design:type", Date)
], Payment.prototype, "lastEditAllowedUntil", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: "created_at" }),
    __metadata("design:type", Date)
], Payment.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: "updated_at" }),
    __metadata("design:type", Date)
], Payment.prototype, "updatedAt", void 0);
exports.Payment = Payment = __decorate([
    (0, typeorm_1.Entity)("payments")
], Payment);
//# sourceMappingURL=payment.entity.js.map