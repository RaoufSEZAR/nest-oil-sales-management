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
exports.Purchase = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const center_entity_1 = require("../../centers/entities/center.entity");
const user_entity_1 = require("../../users/entities/user.entity");
const purchase_item_entity_1 = require("./purchase-item.entity");
const purchase_distribution_entity_1 = require("./purchase-distribution.entity");
const trade_currency_enum_1 = require("../enums/trade-currency.enum");
const purchase_payment_status_enum_1 = require("../enums/purchase-payment-status.enum");
const purchase_receipt_status_enum_1 = require("../enums/purchase-receipt-status.enum");
let Purchase = class Purchase {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => Number }, purchaseNumber: { required: true, type: () => String }, center: { required: false, type: () => require("../../centers/entities/center.entity").Center, nullable: true }, supplierName: { required: true, type: () => String }, supplierPhone: { required: false, type: () => String, nullable: true }, date: { required: true, type: () => String }, totalAmount: { required: true, type: () => String }, paidAmount: { required: true, type: () => String }, currency: { required: true, enum: require("../enums/trade-currency.enum").TradeCurrency }, exchangeRate: { required: true, type: () => String }, amountUsd: { required: true, type: () => String }, paymentStatus: { required: true, enum: require("../enums/purchase-payment-status.enum").PurchasePaymentStatus }, receiptStatus: { required: true, enum: require("../enums/purchase-receipt-status.enum").PurchaseReceiptStatus }, confirmedBy: { required: false, type: () => require("../../users/entities/user.entity").User, nullable: true }, confirmedAt: { required: false, type: () => Date, nullable: true }, createdBy: { required: true, type: () => require("../../users/entities/user.entity").User }, purchaseType: { required: true, type: () => String }, customsCost: { required: true, type: () => String }, shippingCost: { required: true, type: () => String }, distributionStatus: { required: false, type: () => String, nullable: true }, notes: { required: false, type: () => String, nullable: true }, items: { required: true, type: () => [require("./purchase-item.entity").PurchaseItem] }, distributions: { required: true, type: () => [require("./purchase-distribution.entity").PurchaseDistribution] }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date } };
    }
};
exports.Purchase = Purchase;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Purchase.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "purchase_number", type: "varchar", length: 50, unique: true }),
    __metadata("design:type", String)
], Purchase.prototype, "purchaseNumber", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => center_entity_1.Center, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: "center_id" }),
    __metadata("design:type", center_entity_1.Center)
], Purchase.prototype, "center", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "supplier_name", type: "varchar", length: 150 }),
    __metadata("design:type", String)
], Purchase.prototype, "supplierName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "supplier_phone", type: "varchar", length: 30, nullable: true }),
    __metadata("design:type", String)
], Purchase.prototype, "supplierPhone", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "date" }),
    __metadata("design:type", String)
], Purchase.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "total_amount", type: "decimal", precision: 15, scale: 4 }),
    __metadata("design:type", String)
], Purchase.prototype, "totalAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "paid_amount", type: "decimal", precision: 15, scale: 4, default: 0 }),
    __metadata("design:type", String)
], Purchase.prototype, "paidAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "enum",
        enum: trade_currency_enum_1.TradeCurrency,
        default: trade_currency_enum_1.TradeCurrency.USD,
    }),
    __metadata("design:type", String)
], Purchase.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "exchange_rate", type: "decimal", precision: 10, scale: 2, default: 1 }),
    __metadata("design:type", String)
], Purchase.prototype, "exchangeRate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "amount_usd", type: "decimal", precision: 15, scale: 4, default: 0 }),
    __metadata("design:type", String)
], Purchase.prototype, "amountUsd", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: "payment_status",
        type: "enum",
        enum: purchase_payment_status_enum_1.PurchasePaymentStatus,
        default: purchase_payment_status_enum_1.PurchasePaymentStatus.UNPAID,
    }),
    __metadata("design:type", String)
], Purchase.prototype, "paymentStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: "receipt_status",
        type: "enum",
        enum: purchase_receipt_status_enum_1.PurchaseReceiptStatus,
        default: purchase_receipt_status_enum_1.PurchaseReceiptStatus.PENDING,
    }),
    __metadata("design:type", String)
], Purchase.prototype, "receiptStatus", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: "confirmed_by" }),
    __metadata("design:type", user_entity_1.User)
], Purchase.prototype, "confirmedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "confirmed_at", type: "timestamp", nullable: true }),
    __metadata("design:type", Date)
], Purchase.prototype, "confirmedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: "created_by" }),
    __metadata("design:type", user_entity_1.User)
], Purchase.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "purchase_type", type: "varchar", length: 20, default: "center" }),
    __metadata("design:type", String)
], Purchase.prototype, "purchaseType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "customs_cost", type: "decimal", precision: 15, scale: 4, default: 0 }),
    __metadata("design:type", String)
], Purchase.prototype, "customsCost", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "shipping_cost", type: "decimal", precision: 15, scale: 4, default: 0 }),
    __metadata("design:type", String)
], Purchase.prototype, "shippingCost", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "distribution_status", type: "varchar", length: 20, nullable: true }),
    __metadata("design:type", String)
], Purchase.prototype, "distributionStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], Purchase.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => purchase_item_entity_1.PurchaseItem, (line) => line.purchase),
    __metadata("design:type", Array)
], Purchase.prototype, "items", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => purchase_distribution_entity_1.PurchaseDistribution, (line) => line.purchase),
    __metadata("design:type", Array)
], Purchase.prototype, "distributions", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: "created_at" }),
    __metadata("design:type", Date)
], Purchase.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: "updated_at" }),
    __metadata("design:type", Date)
], Purchase.prototype, "updatedAt", void 0);
exports.Purchase = Purchase = __decorate([
    (0, typeorm_1.Entity)("purchases")
], Purchase);
//# sourceMappingURL=purchase.entity.js.map