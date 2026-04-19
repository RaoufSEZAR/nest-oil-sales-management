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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErpInventoryTransfersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const inventory_transfer_entity_1 = require("./entities/inventory-transfer.entity");
const transfer_item_entity_1 = require("./entities/transfer-item.entity");
const sequence_service_1 = require("./sequence.service");
const transfer_status_enum_1 = require("./enums/transfer-status.enum");
function dec4(n) {
    return n.toFixed(4);
}
let ErpInventoryTransfersService = class ErpInventoryTransfersService {
    constructor(transfers, items, sequences) {
        this.transfers = transfers;
        this.items = items;
        this.sequences = sequences;
    }
    findAll() {
        return this.transfers.find({
            order: { id: "DESC" },
            relations: {
                transferredBy: true,
                receivedBy: true,
                items: { product: true },
            },
        });
    }
    async findOne(id) {
        const row = await this.transfers.findOne({
            where: { id },
            relations: {
                transferredBy: true,
                receivedBy: true,
                items: { product: true },
            },
        });
        if (!row)
            throw new common_1.NotFoundException(`Inventory transfer ${id} not found`);
        return row;
    }
    async create(dto) {
        const transferNumber = await this.sequences.next("TRF");
        const transfer = this.transfers.create({
            transferNumber,
            fromLocationType: dto.fromLocationType,
            fromLocationId: dto.fromLocationId,
            toLocationType: dto.toLocationType,
            toLocationId: dto.toLocationId,
            date: dto.date.slice(0, 10),
            transferredBy: dto.transferredById
                ? { id: dto.transferredById }
                : undefined,
            receivedBy: dto.receivedById
                ? { id: dto.receivedById }
                : undefined,
            status: dto.status ?? transfer_status_enum_1.TransferStatus.PENDING,
            notes: dto.notes ?? null,
            completedAt: null,
        });
        await this.transfers.save(transfer);
        for (const line of dto.items) {
            const item = this.items.create({
                transfer: { id: transfer.id },
                product: { id: line.productId },
                quantity: dec4(line.quantity),
            });
            await this.items.save(item);
        }
        return this.findOne(transfer.id);
    }
    async update(id, dto) {
        const row = await this.findOne(id);
        if (dto.status !== undefined)
            row.status = dto.status;
        if (dto.receivedById !== undefined) {
            row.receivedBy = dto.receivedById
                ? { id: dto.receivedById }
                : null;
        }
        if (dto.completedAt !== undefined)
            row.completedAt = dto.completedAt ? new Date(dto.completedAt) : null;
        if (dto.notes !== undefined)
            row.notes = dto.notes ?? null;
        await this.transfers.save(row);
        return this.findOne(id);
    }
};
exports.ErpInventoryTransfersService = ErpInventoryTransfersService;
exports.ErpInventoryTransfersService = ErpInventoryTransfersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(inventory_transfer_entity_1.InventoryTransfer)),
    __param(1, (0, typeorm_1.InjectRepository)(transfer_item_entity_1.TransferItem)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        sequence_service_1.SequenceService])
], ErpInventoryTransfersService);
//# sourceMappingURL=inventory-transfers.service.js.map