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
exports.TransferItem = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const inventory_transfer_entity_1 = require("./inventory-transfer.entity");
const product_entity_1 = require("../../products/entities/product.entity");
let TransferItem = class TransferItem {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => Number }, transfer: { required: true, type: () => require("./inventory-transfer.entity").InventoryTransfer }, product: { required: true, type: () => require("../../products/entities/product.entity").Product }, quantity: { required: true, type: () => String }, receivedQuantity: { required: false, type: () => String, nullable: true }, conditionNotes: { required: false, type: () => String, nullable: true } };
    }
};
exports.TransferItem = TransferItem;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], TransferItem.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => inventory_transfer_entity_1.InventoryTransfer, (t) => t.items, {
        onDelete: "CASCADE",
    }),
    (0, typeorm_1.JoinColumn)({ name: "transfer_id" }),
    __metadata("design:type", inventory_transfer_entity_1.InventoryTransfer)
], TransferItem.prototype, "transfer", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => product_entity_1.Product),
    (0, typeorm_1.JoinColumn)({ name: "product_id" }),
    __metadata("design:type", product_entity_1.Product)
], TransferItem.prototype, "product", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "decimal", precision: 10, scale: 2 }),
    __metadata("design:type", String)
], TransferItem.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "received_quantity", type: "decimal", precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", String)
], TransferItem.prototype, "receivedQuantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "condition_notes", type: "text", nullable: true }),
    __metadata("design:type", String)
], TransferItem.prototype, "conditionNotes", void 0);
exports.TransferItem = TransferItem = __decorate([
    (0, typeorm_1.Entity)("transfer_items")
], TransferItem);
//# sourceMappingURL=transfer-item.entity.js.map