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
exports.InventoryService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const product_entity_1 = require("./entities/product.entity");
let InventoryService = class InventoryService {
    constructor(inventoryRepo, productRepo) {
        this.inventoryRepo = inventoryRepo;
        this.productRepo = productRepo;
    }
    async findByLocation(filters) {
        const where = {};
        if (filters.locationType)
            where.locationType = filters.locationType;
        if (filters.locationId)
            where.locationId = filters.locationId;
        const inventory = await this.inventoryRepo.find({
            where,
            relations: { product: true },
            order: { id: "ASC" },
        });
        let totalValue = 0;
        let lowStockItems = 0;
        for (const row of inventory) {
            const qty = parseFloat(row.quantity);
            const price = parseFloat(row.product?.price ?? "0");
            totalValue += qty * price;
            if (qty < 10)
                lowStockItems++;
        }
        return {
            inventory,
            stats: {
                total_items: inventory.length,
                total_value: totalValue,
                low_stock_items: lowStockItems,
            },
        };
    }
    async findByProduct(productId) {
        const product = await this.productRepo.findOne({ where: { id: productId } });
        if (!product)
            throw new common_1.NotFoundException(`Product ${productId} not found`);
        const rows = await this.inventoryRepo.find({
            where: { productId },
            order: { locationType: "ASC", locationId: "ASC" },
        });
        return {
            product,
            warehouse_stock: parseFloat(product.stock),
            locations: rows,
        };
    }
    async updateQuantity(productId, locationType, locationId, quantity) {
        if (quantity < 0) {
            throw new common_1.BadRequestException("Quantity cannot be negative");
        }
        let row = await this.inventoryRepo.findOne({
            where: { productId, locationType, locationId },
        });
        if (!row) {
            const product = await this.productRepo.findOne({ where: { id: productId } });
            if (!product)
                throw new common_1.NotFoundException(`Product ${productId} not found`);
            row = this.inventoryRepo.create({
                productId,
                locationType,
                locationId,
                quantity: quantity.toFixed(2),
            });
        }
        else {
            row.quantity = quantity.toFixed(2);
        }
        return this.inventoryRepo.save(row);
    }
    async getLowStockAlerts(threshold = 10) {
        const rows = await this.inventoryRepo.find({ relations: { product: true } });
        const alerts = rows.filter((r) => parseFloat(r.quantity) < threshold);
        return { alerts, count: alerts.length };
    }
};
exports.InventoryService = InventoryService;
exports.InventoryService = InventoryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(product_entity_1.Inventory)),
    __param(1, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], InventoryService);
//# sourceMappingURL=inventory.service.js.map