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
exports.SalesReturn = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const customer_entity_1 = require("./customer.entity");
const user_entity_1 = require("../../users/entities/user.entity");
const invoice_entity_1 = require("./invoice.entity");
const return_item_entity_1 = require("./return-item.entity");
const sales_return_type_enum_1 = require("../enums/sales-return-type.enum");
const sales_return_status_enum_1 = require("../enums/sales-return-status.enum");
let SalesReturn = class SalesReturn {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => Number }, returnNumber: { required: true, type: () => String }, returnType: { required: true, enum: require("../enums/sales-return-type.enum").SalesReturnType }, originalInvoice: { required: false, type: () => require("./invoice.entity").Invoice, nullable: true }, customer: { required: true, type: () => require("./customer.entity").Customer }, salesRep: { required: true, type: () => require("../../users/entities/user.entity").User }, date: { required: true, type: () => String }, totalAmount: { required: true, type: () => String }, reason: { required: false, type: () => String, nullable: true }, status: { required: true, enum: require("../enums/sales-return-status.enum").SalesReturnStatus }, notes: { required: false, type: () => String, nullable: true }, synced: { required: true, type: () => Boolean }, items: { required: true, type: () => [require("./return-item.entity").ReturnItem] }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date } };
    }
};
exports.SalesReturn = SalesReturn;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], SalesReturn.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "return_number", type: "varchar", length: 50, unique: true }),
    __metadata("design:type", String)
], SalesReturn.prototype, "returnNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: "return_type",
        type: "enum",
        enum: sales_return_type_enum_1.SalesReturnType,
    }),
    __metadata("design:type", String)
], SalesReturn.prototype, "returnType", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => invoice_entity_1.Invoice, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: "original_invoice_id" }),
    __metadata("design:type", invoice_entity_1.Invoice)
], SalesReturn.prototype, "originalInvoice", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => customer_entity_1.Customer),
    (0, typeorm_1.JoinColumn)({ name: "customer_id" }),
    __metadata("design:type", customer_entity_1.Customer)
], SalesReturn.prototype, "customer", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: "sales_rep_id" }),
    __metadata("design:type", user_entity_1.User)
], SalesReturn.prototype, "salesRep", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "date" }),
    __metadata("design:type", String)
], SalesReturn.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "total_amount", type: "decimal", precision: 10, scale: 2 }),
    __metadata("design:type", String)
], SalesReturn.prototype, "totalAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255, nullable: true }),
    __metadata("design:type", String)
], SalesReturn.prototype, "reason", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "enum",
        enum: sales_return_status_enum_1.SalesReturnStatus,
        default: sales_return_status_enum_1.SalesReturnStatus.APPROVED,
    }),
    __metadata("design:type", String)
], SalesReturn.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], SalesReturn.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], SalesReturn.prototype, "synced", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => return_item_entity_1.ReturnItem, (line) => line.salesReturn),
    __metadata("design:type", Array)
], SalesReturn.prototype, "items", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: "created_at" }),
    __metadata("design:type", Date)
], SalesReturn.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: "updated_at" }),
    __metadata("design:type", Date)
], SalesReturn.prototype, "updatedAt", void 0);
exports.SalesReturn = SalesReturn = __decorate([
    (0, typeorm_1.Entity)("returns")
], SalesReturn);
//# sourceMappingURL=sales-return.entity.js.map