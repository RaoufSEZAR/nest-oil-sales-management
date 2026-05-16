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
exports.PurchaseDistribution = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const purchase_entity_1 = require("./purchase.entity");
const center_entity_1 = require("../../centers/entities/center.entity");
const product_entity_1 = require("../../products/entities/product.entity");
const user_entity_1 = require("../../users/entities/user.entity");
let PurchaseDistribution = class PurchaseDistribution {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => Number }, purchase: { required: true, type: () => require("./purchase.entity").Purchase }, center: { required: true, type: () => require("../../centers/entities/center.entity").Center }, product: { required: true, type: () => require("../../products/entities/product.entity").Product }, quantity: { required: true, type: () => String }, distributedBy: { required: false, type: () => require("../../users/entities/user.entity").User, nullable: true }, distributedAt: { required: true, type: () => Date }, notes: { required: false, type: () => String, nullable: true } };
    }
};
exports.PurchaseDistribution = PurchaseDistribution;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], PurchaseDistribution.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => purchase_entity_1.Purchase, (p) => p.distributions),
    (0, typeorm_1.JoinColumn)({ name: "purchase_id" }),
    __metadata("design:type", purchase_entity_1.Purchase)
], PurchaseDistribution.prototype, "purchase", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => center_entity_1.Center),
    (0, typeorm_1.JoinColumn)({ name: "center_id" }),
    __metadata("design:type", center_entity_1.Center)
], PurchaseDistribution.prototype, "center", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => product_entity_1.Product),
    (0, typeorm_1.JoinColumn)({ name: "product_id" }),
    __metadata("design:type", product_entity_1.Product)
], PurchaseDistribution.prototype, "product", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "decimal", precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", String)
], PurchaseDistribution.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: "distributed_by" }),
    __metadata("design:type", user_entity_1.User)
], PurchaseDistribution.prototype, "distributedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "distributed_at", type: "timestamp", default: () => "CURRENT_TIMESTAMP" }),
    __metadata("design:type", Date)
], PurchaseDistribution.prototype, "distributedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], PurchaseDistribution.prototype, "notes", void 0);
exports.PurchaseDistribution = PurchaseDistribution = __decorate([
    (0, typeorm_1.Entity)("purchase_distributions")
], PurchaseDistribution);
//# sourceMappingURL=purchase-distribution.entity.js.map