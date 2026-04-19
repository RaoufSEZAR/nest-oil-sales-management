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
exports.Expense = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const center_entity_1 = require("../../centers/entities/center.entity");
const user_entity_1 = require("../../users/entities/user.entity");
const trade_currency_enum_1 = require("../enums/trade-currency.enum");
let Expense = class Expense {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => Number }, expenseNumber: { required: true, type: () => String }, center: { required: false, type: () => require("../../centers/entities/center.entity").Center, nullable: true }, category: { required: true, type: () => String }, description: { required: false, type: () => String, nullable: true }, amount: { required: true, type: () => String }, currency: { required: true, enum: require("../enums/trade-currency.enum").TradeCurrency }, exchangeRate: { required: true, type: () => String }, amountUsd: { required: true, type: () => String }, date: { required: true, type: () => String }, paidBy: { required: true, type: () => require("../../users/entities/user.entity").User }, notes: { required: false, type: () => String, nullable: true }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date } };
    }
};
exports.Expense = Expense;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Expense.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "expense_number", type: "varchar", length: 50, unique: true }),
    __metadata("design:type", String)
], Expense.prototype, "expenseNumber", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => center_entity_1.Center, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: "center_id" }),
    __metadata("design:type", center_entity_1.Center)
], Expense.prototype, "center", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 50 }),
    __metadata("design:type", String)
], Expense.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255, nullable: true }),
    __metadata("design:type", String)
], Expense.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "decimal", precision: 15, scale: 4 }),
    __metadata("design:type", String)
], Expense.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "enum",
        enum: trade_currency_enum_1.TradeCurrency,
        default: trade_currency_enum_1.TradeCurrency.USD,
    }),
    __metadata("design:type", String)
], Expense.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "exchange_rate", type: "decimal", precision: 10, scale: 2, default: 1 }),
    __metadata("design:type", String)
], Expense.prototype, "exchangeRate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "amount_usd", type: "decimal", precision: 15, scale: 4 }),
    __metadata("design:type", String)
], Expense.prototype, "amountUsd", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "date" }),
    __metadata("design:type", String)
], Expense.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: "paid_by" }),
    __metadata("design:type", user_entity_1.User)
], Expense.prototype, "paidBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], Expense.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: "created_at" }),
    __metadata("design:type", Date)
], Expense.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: "updated_at" }),
    __metadata("design:type", Date)
], Expense.prototype, "updatedAt", void 0);
exports.Expense = Expense = __decorate([
    (0, typeorm_1.Entity)("expenses")
], Expense);
//# sourceMappingURL=expense.entity.js.map