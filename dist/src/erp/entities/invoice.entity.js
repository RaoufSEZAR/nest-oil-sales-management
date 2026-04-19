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
exports.Invoice = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const customer_entity_1 = require("./customer.entity");
const user_entity_1 = require("../../users/entities/user.entity");
const vehicle_trip_entity_1 = require("./vehicle-trip.entity");
const invoice_item_entity_1 = require("./invoice-item.entity");
const trade_currency_enum_1 = require("../enums/trade-currency.enum");
const invoice_payment_status_enum_1 = require("../enums/invoice-payment-status.enum");
let Invoice = class Invoice {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => Number }, invoiceNumber: { required: true, type: () => String }, customer: { required: true, type: () => require("./customer.entity").Customer }, salesRep: { required: true, type: () => require("../../users/entities/user.entity").User }, date: { required: true, type: () => Date }, subtotal: { required: true, type: () => String }, discount: { required: true, type: () => String }, taxRate: { required: true, type: () => String }, taxAmount: { required: true, type: () => String }, totalAmount: { required: true, type: () => String }, paidAmount: { required: true, type: () => String }, currency: { required: true, enum: require("../enums/trade-currency.enum").TradeCurrency }, exchangeRate: { required: true, type: () => String }, paymentStatus: { required: true, enum: require("../enums/invoice-payment-status.enum").InvoicePaymentStatus }, notes: { required: false, type: () => String, nullable: true }, trip: { required: false, type: () => require("./vehicle-trip.entity").VehicleTrip, nullable: true }, editedOnce: { required: true, type: () => Boolean }, lastEditAllowedUntil: { required: false, type: () => Date, nullable: true }, synced: { required: true, type: () => Boolean }, items: { required: true, type: () => [require("./invoice-item.entity").InvoiceItem] }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date } };
    }
};
exports.Invoice = Invoice;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Invoice.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "invoice_number", type: "varchar", length: 50, unique: true }),
    __metadata("design:type", String)
], Invoice.prototype, "invoiceNumber", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => customer_entity_1.Customer, { onDelete: "RESTRICT" }),
    (0, typeorm_1.JoinColumn)({ name: "customer_id" }),
    __metadata("design:type", customer_entity_1.Customer)
], Invoice.prototype, "customer", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: "sales_rep_id" }),
    __metadata("design:type", user_entity_1.User)
], Invoice.prototype, "salesRep", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamp" }),
    __metadata("design:type", Date)
], Invoice.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "decimal", precision: 10, scale: 2 }),
    __metadata("design:type", String)
], Invoice.prototype, "subtotal", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "decimal", precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", String)
], Invoice.prototype, "discount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "tax_rate", type: "decimal", precision: 5, scale: 2, default: 0 }),
    __metadata("design:type", String)
], Invoice.prototype, "taxRate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "tax_amount", type: "decimal", precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", String)
], Invoice.prototype, "taxAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "total_amount", type: "decimal", precision: 10, scale: 2 }),
    __metadata("design:type", String)
], Invoice.prototype, "totalAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "paid_amount", type: "decimal", precision: 15, scale: 4, default: 0 }),
    __metadata("design:type", String)
], Invoice.prototype, "paidAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "enum",
        enum: trade_currency_enum_1.TradeCurrency,
        default: trade_currency_enum_1.TradeCurrency.USD,
    }),
    __metadata("design:type", String)
], Invoice.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "exchange_rate", type: "decimal", precision: 10, scale: 2, default: 1 }),
    __metadata("design:type", String)
], Invoice.prototype, "exchangeRate", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: "payment_status",
        type: "enum",
        enum: invoice_payment_status_enum_1.InvoicePaymentStatus,
        default: invoice_payment_status_enum_1.InvoicePaymentStatus.PENDING,
    }),
    __metadata("design:type", String)
], Invoice.prototype, "paymentStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], Invoice.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => vehicle_trip_entity_1.VehicleTrip, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: "trip_id" }),
    __metadata("design:type", vehicle_trip_entity_1.VehicleTrip)
], Invoice.prototype, "trip", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "edited_once", default: false }),
    __metadata("design:type", Boolean)
], Invoice.prototype, "editedOnce", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "last_edit_allowed_until", type: "timestamp", nullable: true }),
    __metadata("design:type", Date)
], Invoice.prototype, "lastEditAllowedUntil", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Invoice.prototype, "synced", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => invoice_item_entity_1.InvoiceItem, (line) => line.invoice),
    __metadata("design:type", Array)
], Invoice.prototype, "items", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: "created_at" }),
    __metadata("design:type", Date)
], Invoice.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: "updated_at" }),
    __metadata("design:type", Date)
], Invoice.prototype, "updatedAt", void 0);
exports.Invoice = Invoice = __decorate([
    (0, typeorm_1.Entity)("invoices")
], Invoice);
//# sourceMappingURL=invoice.entity.js.map