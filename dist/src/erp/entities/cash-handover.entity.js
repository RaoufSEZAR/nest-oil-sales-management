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
exports.CashHandover = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
const cash_handover_status_enum_1 = require("../enums/cash-handover-status.enum");
let CashHandover = class CashHandover {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => Number }, handoverNumber: { required: true, type: () => String }, fromType: { required: true, type: () => String }, fromId: { required: true, type: () => Number }, toType: { required: true, type: () => String }, toId: { required: true, type: () => Number }, amount: { required: true, type: () => String }, originalCurrency: { required: true, type: () => String }, originalAmount: { required: false, type: () => String, nullable: true }, handoverDate: { required: true, type: () => Date }, handedBy: { required: true, type: () => require("../../users/entities/user.entity").User }, receivedBy: { required: false, type: () => require("../../users/entities/user.entity").User, nullable: true }, notes: { required: false, type: () => String, nullable: true }, status: { required: true, enum: require("../enums/cash-handover-status.enum").CashHandoverStatus }, confirmedAt: { required: false, type: () => Date, nullable: true }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date } };
    }
};
exports.CashHandover = CashHandover;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], CashHandover.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "handover_number", type: "varchar", length: 50, unique: true }),
    __metadata("design:type", String)
], CashHandover.prototype, "handoverNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "from_type", type: "varchar", length: 20 }),
    __metadata("design:type", String)
], CashHandover.prototype, "fromType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "from_id", type: "int" }),
    __metadata("design:type", Number)
], CashHandover.prototype, "fromId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "to_type", type: "varchar", length: 20 }),
    __metadata("design:type", String)
], CashHandover.prototype, "toType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "to_id", type: "int" }),
    __metadata("design:type", Number)
], CashHandover.prototype, "toId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "decimal", precision: 15, scale: 4 }),
    __metadata("design:type", String)
], CashHandover.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "original_currency", type: "varchar", length: 10, default: "USD" }),
    __metadata("design:type", String)
], CashHandover.prototype, "originalCurrency", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "original_amount", type: "decimal", precision: 15, scale: 4, nullable: true }),
    __metadata("design:type", String)
], CashHandover.prototype, "originalAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "handover_date", type: "timestamp" }),
    __metadata("design:type", Date)
], CashHandover.prototype, "handoverDate", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: "handed_by" }),
    __metadata("design:type", user_entity_1.User)
], CashHandover.prototype, "handedBy", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: "received_by" }),
    __metadata("design:type", user_entity_1.User)
], CashHandover.prototype, "receivedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], CashHandover.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "enum",
        enum: cash_handover_status_enum_1.CashHandoverStatus,
        default: cash_handover_status_enum_1.CashHandoverStatus.PENDING,
    }),
    __metadata("design:type", String)
], CashHandover.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "confirmed_at", type: "timestamp", nullable: true }),
    __metadata("design:type", Date)
], CashHandover.prototype, "confirmedAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: "created_at" }),
    __metadata("design:type", Date)
], CashHandover.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: "updated_at" }),
    __metadata("design:type", Date)
], CashHandover.prototype, "updatedAt", void 0);
exports.CashHandover = CashHandover = __decorate([
    (0, typeorm_1.Entity)("cash_handovers")
], CashHandover);
//# sourceMappingURL=cash-handover.entity.js.map