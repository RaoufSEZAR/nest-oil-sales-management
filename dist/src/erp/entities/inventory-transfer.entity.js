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
exports.InventoryTransfer = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
const transfer_item_entity_1 = require("./transfer-item.entity");
const transfer_location_type_enum_1 = require("../enums/transfer-location-type.enum");
const transfer_status_enum_1 = require("../enums/transfer-status.enum");
let InventoryTransfer = class InventoryTransfer {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => Number }, transferNumber: { required: true, type: () => String }, fromLocationType: { required: true, enum: require("../enums/transfer-location-type.enum").TransferLocationType }, fromLocationId: { required: true, type: () => Number }, toLocationType: { required: true, enum: require("../enums/transfer-location-type.enum").TransferLocationType }, toLocationId: { required: true, type: () => Number }, date: { required: true, type: () => String }, transferredBy: { required: false, type: () => require("../../users/entities/user.entity").User, nullable: true }, receivedBy: { required: false, type: () => require("../../users/entities/user.entity").User, nullable: true }, status: { required: true, enum: require("../enums/transfer-status.enum").TransferStatus }, notes: { required: false, type: () => String, nullable: true }, completedAt: { required: false, type: () => Date, nullable: true }, items: { required: true, type: () => [require("./transfer-item.entity").TransferItem] }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date } };
    }
};
exports.InventoryTransfer = InventoryTransfer;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], InventoryTransfer.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "transfer_number", type: "varchar", length: 50, unique: true }),
    __metadata("design:type", String)
], InventoryTransfer.prototype, "transferNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "from_location_type", type: "enum", enum: transfer_location_type_enum_1.TransferLocationType }),
    __metadata("design:type", String)
], InventoryTransfer.prototype, "fromLocationType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "from_location_id", type: "int" }),
    __metadata("design:type", Number)
], InventoryTransfer.prototype, "fromLocationId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "to_location_type", type: "enum", enum: transfer_location_type_enum_1.TransferLocationType }),
    __metadata("design:type", String)
], InventoryTransfer.prototype, "toLocationType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "to_location_id", type: "int" }),
    __metadata("design:type", Number)
], InventoryTransfer.prototype, "toLocationId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "date" }),
    __metadata("design:type", String)
], InventoryTransfer.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: "transferred_by" }),
    __metadata("design:type", user_entity_1.User)
], InventoryTransfer.prototype, "transferredBy", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: "received_by" }),
    __metadata("design:type", user_entity_1.User)
], InventoryTransfer.prototype, "receivedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "enum",
        enum: transfer_status_enum_1.TransferStatus,
        default: transfer_status_enum_1.TransferStatus.PENDING,
    }),
    __metadata("design:type", String)
], InventoryTransfer.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], InventoryTransfer.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "completed_at", type: "timestamp", nullable: true }),
    __metadata("design:type", Date)
], InventoryTransfer.prototype, "completedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => transfer_item_entity_1.TransferItem, (line) => line.transfer, { cascade: true }),
    __metadata("design:type", Array)
], InventoryTransfer.prototype, "items", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: "created_at" }),
    __metadata("design:type", Date)
], InventoryTransfer.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: "updated_at" }),
    __metadata("design:type", Date)
], InventoryTransfer.prototype, "updatedAt", void 0);
exports.InventoryTransfer = InventoryTransfer = __decorate([
    (0, typeorm_1.Entity)("inventory_transfers")
], InventoryTransfer);
//# sourceMappingURL=inventory-transfer.entity.js.map