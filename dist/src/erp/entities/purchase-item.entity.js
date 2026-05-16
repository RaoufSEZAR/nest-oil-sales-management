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
exports.PurchaseItem = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const purchase_entity_1 = require("./purchase.entity");
const product_entity_1 = require("../../products/entities/product.entity");
let PurchaseItem = class PurchaseItem {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => Number }, purchase: { required: true, type: () => require("./purchase.entity").Purchase }, product: { required: false, type: () => require("../../products/entities/product.entity").Product, nullable: true }, description: { required: false, type: () => String, nullable: true }, quantity: { required: true, type: () => String }, unitPriceUsd: { required: true, type: () => String }, totalUsd: { required: true, type: () => String }, distributedQty: { required: true, type: () => String } };
    }
};
exports.PurchaseItem = PurchaseItem;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], PurchaseItem.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => purchase_entity_1.Purchase, (p) => p.items, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: "purchase_id" }),
    __metadata("design:type", purchase_entity_1.Purchase)
], PurchaseItem.prototype, "purchase", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => product_entity_1.Product, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: "product_id" }),
    __metadata("design:type", product_entity_1.Product)
], PurchaseItem.prototype, "product", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255, nullable: true }),
    __metadata("design:type", String)
], PurchaseItem.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "decimal", precision: 10, scale: 2 }),
    __metadata("design:type", String)
], PurchaseItem.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "unit_price_usd", type: "decimal", precision: 15, scale: 4 }),
    __metadata("design:type", String)
], PurchaseItem.prototype, "unitPriceUsd", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "total_usd", type: "decimal", precision: 15, scale: 4 }),
    __metadata("design:type", String)
], PurchaseItem.prototype, "totalUsd", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "distributed_qty", type: "decimal", precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", String)
], PurchaseItem.prototype, "distributedQty", void 0);
exports.PurchaseItem = PurchaseItem = __decorate([
    (0, typeorm_1.Entity)("purchase_items")
], PurchaseItem);
//# sourceMappingURL=purchase-item.entity.js.map