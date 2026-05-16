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
exports.ReturnItem = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const sales_return_entity_1 = require("./sales-return.entity");
const product_entity_1 = require("../../products/entities/product.entity");
const return_item_condition_enum_1 = require("../enums/return-item-condition.enum");
let ReturnItem = class ReturnItem {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => Number }, salesReturn: { required: true, type: () => require("./sales-return.entity").SalesReturn }, product: { required: true, type: () => require("../../products/entities/product.entity").Product }, quantity: { required: true, type: () => String }, unitPrice: { required: true, type: () => String }, total: { required: true, type: () => String }, condition: { required: true, enum: require("../enums/return-item-condition.enum").ReturnItemCondition }, reasonDetail: { required: false, type: () => String, nullable: true } };
    }
};
exports.ReturnItem = ReturnItem;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ReturnItem.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => sales_return_entity_1.SalesReturn, (r) => r.items, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: "return_id" }),
    __metadata("design:type", sales_return_entity_1.SalesReturn)
], ReturnItem.prototype, "salesReturn", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => product_entity_1.Product),
    (0, typeorm_1.JoinColumn)({ name: "product_id" }),
    __metadata("design:type", product_entity_1.Product)
], ReturnItem.prototype, "product", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "decimal", precision: 10, scale: 2 }),
    __metadata("design:type", String)
], ReturnItem.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "unit_price", type: "decimal", precision: 10, scale: 2 }),
    __metadata("design:type", String)
], ReturnItem.prototype, "unitPrice", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "decimal", precision: 10, scale: 2 }),
    __metadata("design:type", String)
], ReturnItem.prototype, "total", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "enum",
        enum: return_item_condition_enum_1.ReturnItemCondition,
        default: return_item_condition_enum_1.ReturnItemCondition.GOOD,
    }),
    __metadata("design:type", String)
], ReturnItem.prototype, "condition", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "reason_detail", type: "text", nullable: true }),
    __metadata("design:type", String)
], ReturnItem.prototype, "reasonDetail", void 0);
exports.ReturnItem = ReturnItem = __decorate([
    (0, typeorm_1.Entity)("return_items")
], ReturnItem);
//# sourceMappingURL=return-item.entity.js.map