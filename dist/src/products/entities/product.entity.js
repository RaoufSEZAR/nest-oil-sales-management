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
exports.Inventory = exports.Product = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const inventory_location_type_enum_1 = require("../enums/inventory-location-type.enum");
let Product = class Product {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => Number }, name: { required: true, type: () => String }, sku: { required: true, type: () => String }, category: { required: false, type: () => String, nullable: true }, unit: { required: true, type: () => String }, price: { required: true, type: () => String }, cost: { required: false, type: () => String, nullable: true }, active: { required: true, type: () => Boolean }, inventory: { required: true, type: () => [require("./product.entity").Inventory] }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date } };
    }
};
exports.Product = Product;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Product.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ type: "varchar", length: 100 }),
    __metadata("design:type", String)
], Product.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ type: "varchar", length: 50, unique: true }),
    __metadata("design:type", String)
], Product.prototype, "sku", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, typeorm_1.Column)({ type: "varchar", length: 50, nullable: true }),
    __metadata("design:type", String)
], Product.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, default: "قطعة" }),
    (0, typeorm_1.Column)({ type: "varchar", length: 20, default: "قطعة" }),
    __metadata("design:type", String)
], Product.prototype, "unit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ type: "decimal", precision: 10, scale: 2 }),
    __metadata("design:type", String)
], Product.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, typeorm_1.Column)({ type: "decimal", precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", String)
], Product.prototype, "cost", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Product.prototype, "active", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Inventory, (inv) => inv.product),
    __metadata("design:type", Array)
], Product.prototype, "inventory", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: "created_at" }),
    __metadata("design:type", Date)
], Product.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: "updated_at" }),
    __metadata("design:type", Date)
], Product.prototype, "updatedAt", void 0);
exports.Product = Product = __decorate([
    (0, typeorm_1.Entity)("products")
], Product);
let Inventory = class Inventory {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => Number }, productId: { required: true, type: () => Number }, product: { required: true, type: () => require("./product.entity").Product }, locationType: { required: true, enum: require("../enums/inventory-location-type.enum").InventoryLocationType }, locationId: { required: true, type: () => Number }, quantity: { required: true, type: () => String }, lastUpdated: { required: true, type: () => Date } };
    }
};
exports.Inventory = Inventory;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Inventory.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "product_id", type: "int" }),
    __metadata("design:type", Number)
], Inventory.prototype, "productId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Product, (p) => p.inventory, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: "product_id" }),
    __metadata("design:type", Product)
], Inventory.prototype, "product", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: inventory_location_type_enum_1.InventoryLocationType }),
    (0, typeorm_1.Column)({
        name: "location_type",
        type: "enum",
        enum: inventory_location_type_enum_1.InventoryLocationType,
    }),
    __metadata("design:type", String)
], Inventory.prototype, "locationType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Center id or vehicle id depending on locationType",
    }),
    (0, typeorm_1.Column)({ name: "location_id", type: "int" }),
    __metadata("design:type", Number)
], Inventory.prototype, "locationId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ type: "decimal", precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", String)
], Inventory.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: "last_updated" }),
    __metadata("design:type", Date)
], Inventory.prototype, "lastUpdated", void 0);
exports.Inventory = Inventory = __decorate([
    (0, typeorm_1.Entity)("inventory")
], Inventory);
//# sourceMappingURL=product.entity.js.map