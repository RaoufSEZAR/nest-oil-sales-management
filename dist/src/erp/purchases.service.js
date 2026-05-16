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
exports.ErpPurchasesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const purchase_entity_1 = require("./entities/purchase.entity");
const purchase_item_entity_1 = require("./entities/purchase-item.entity");
const purchase_distribution_entity_1 = require("./entities/purchase-distribution.entity");
const sequence_service_1 = require("./sequence.service");
const trade_currency_enum_1 = require("./enums/trade-currency.enum");
const products_service_1 = require("../products/products.service");
function dec4(n) {
    return n.toFixed(4);
}
let ErpPurchasesService = class ErpPurchasesService {
    constructor(purchases, distributions, dataSource, sequences, productsService) {
        this.purchases = purchases;
        this.distributions = distributions;
        this.dataSource = dataSource;
        this.sequences = sequences;
        this.productsService = productsService;
    }
    findAll() {
        return this.purchases.find({
            order: { id: "DESC" },
            relations: {
                center: true,
                createdBy: true,
                confirmedBy: true,
                items: { product: true },
                distributions: { center: true, product: true },
            },
        });
    }
    async findOne(id) {
        const row = await this.purchases.findOne({
            where: { id },
            relations: {
                center: true,
                createdBy: true,
                confirmedBy: true,
                items: { product: true },
                distributions: { center: true, product: true },
            },
        });
        if (!row)
            throw new common_1.NotFoundException(`Purchase ${id} not found`);
        return row;
    }
    async create(dto) {
        const currency = dto.currency ?? trade_currency_enum_1.TradeCurrency.USD;
        const exchangeRate = dto.exchangeRate ?? 1;
        const customs = dto.customsCost ?? 0;
        const shipping = dto.shippingCost ?? 0;
        let linesTotal = 0;
        for (const line of dto.items) {
            linesTotal += line.quantity * line.unitPriceUsd;
        }
        const totalAmount = linesTotal + customs + shipping;
        const amountUsd = totalAmount * exchangeRate;
        return this.dataSource.transaction(async (em) => {
            const purchaseNumber = await this.sequences.next("PO");
            const pur = em.create(purchase_entity_1.Purchase, {
                purchaseNumber,
                center: dto.centerId ? { id: dto.centerId } : undefined,
                supplierName: dto.supplierName,
                supplierPhone: dto.supplierPhone ?? null,
                date: dto.date.slice(0, 10),
                totalAmount: dec4(totalAmount),
                paidAmount: "0",
                currency,
                exchangeRate: dec4(exchangeRate),
                amountUsd: dec4(amountUsd),
                createdBy: { id: dto.createdById },
                customsCost: dec4(customs),
                shippingCost: dec4(shipping),
                notes: dto.notes ?? null,
            });
            await em.save(pur);
            for (const line of dto.items) {
                const lineTotal = line.quantity * line.unitPriceUsd;
                const item = em.create(purchase_item_entity_1.PurchaseItem, {
                    purchase: { id: pur.id },
                    product: line.productId ? { id: line.productId } : null,
                    description: line.description ?? null,
                    quantity: dec4(line.quantity),
                    unitPriceUsd: dec4(line.unitPriceUsd),
                    totalUsd: dec4(lineTotal),
                });
                await em.save(item);
                if (line.productId) {
                    await this.productsService.increaseStock(line.productId, line.quantity, em);
                }
            }
            return em.findOneOrFail(purchase_entity_1.Purchase, {
                where: { id: pur.id },
                relations: {
                    center: true,
                    createdBy: true,
                    items: { product: true },
                    distributions: true,
                },
            });
        });
    }
    async update(id, dto) {
        const row = await this.findOne(id);
        if (dto.supplierName !== undefined)
            row.supplierName = dto.supplierName;
        if (dto.supplierPhone !== undefined)
            row.supplierPhone = dto.supplierPhone ?? null;
        if (dto.notes !== undefined)
            row.notes = dto.notes ?? null;
        await this.purchases.save(row);
        return this.findOne(id);
    }
    async addDistribution(purchaseId, dto) {
        await this.findOne(purchaseId);
        const entity = this.distributions.create({
            purchase: { id: purchaseId },
            center: { id: dto.centerId },
            product: { id: dto.productId },
            quantity: dec4(dto.quantity),
            distributedBy: dto.distributedById
                ? { id: dto.distributedById }
                : undefined,
            notes: dto.notes ?? null,
        });
        const saved = await this.distributions.save(entity);
        await this.productsService.decreaseStock(dto.productId, dto.quantity);
        return saved;
    }
};
exports.ErpPurchasesService = ErpPurchasesService;
exports.ErpPurchasesService = ErpPurchasesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(purchase_entity_1.Purchase)),
    __param(1, (0, typeorm_1.InjectRepository)(purchase_distribution_entity_1.PurchaseDistribution)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource,
        sequence_service_1.SequenceService,
        products_service_1.ProductsService])
], ErpPurchasesService);
//# sourceMappingURL=purchases.service.js.map