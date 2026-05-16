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
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const product_entity_1 = require("./entities/product.entity");
function dec2(n) {
    return n.toFixed(2);
}
function parseStock(value) {
    return Number.parseFloat(value ?? "0") || 0;
}
let ProductsService = class ProductsService {
    constructor(productsRepo) {
        this.productsRepo = productsRepo;
    }
    async findAll(params) {
        const page = Math.max(1, params.page ?? 1);
        const limit = Math.min(500, Math.max(1, params.limit ?? 100));
        const qb = this.productsRepo
            .createQueryBuilder("p")
            .orderBy("p.name", "ASC");
        if (params.search?.trim()) {
            const s = `%${params.search.trim()}%`;
            qb.andWhere("(p.name ILIKE :s OR p.sku ILIKE :s)", { s });
        }
        if (params.category) {
            qb.andWhere("p.category = :cat", { cat: params.category });
        }
        if (params.active !== undefined) {
            qb.andWhere("p.active = :active", { active: params.active });
        }
        const total = await qb.getCount();
        const products = await qb
            .skip((page - 1) * limit)
            .take(limit)
            .getMany();
        return {
            products,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit) || 1,
            },
        };
    }
    async findOne(id) {
        const product = await this.productsRepo.findOne({
            where: { id },
            relations: { inventory: true },
        });
        if (!product) {
            throw new common_1.NotFoundException("Product not found");
        }
        return product;
    }
    async create(dto) {
        const existing = await this.productsRepo.findOne({
            where: { sku: dto.sku },
        });
        if (existing) {
            throw new common_1.ConflictException("Product SKU already exists");
        }
        const product = this.productsRepo.create(this.dtoToEntity(dto));
        return this.productsRepo.save(product);
    }
    async bulkUpsert(items, updateExisting = true) {
        if (!items.length) {
            throw new common_1.BadRequestException("products array must not be empty");
        }
        const result = {
            created: 0,
            updated: 0,
            skipped: 0,
            total: items.length,
            errors: [],
        };
        for (const dto of items) {
            try {
                const existing = await this.productsRepo.findOne({
                    where: { sku: dto.sku },
                });
                if (existing) {
                    if (!updateExisting) {
                        result.skipped++;
                        continue;
                    }
                    this.applyDto(existing, dto);
                    existing.active = true;
                    await this.productsRepo.save(existing);
                    result.updated++;
                }
                else {
                    const product = this.productsRepo.create(this.dtoToEntity(dto));
                    await this.productsRepo.save(product);
                    result.created++;
                }
            }
            catch (err) {
                const message = err instanceof Error ? err.message : "Unknown error";
                result.errors.push({ sku: dto.sku, message });
            }
        }
        return result;
    }
    async increaseStock(productId, quantity, em) {
        if (quantity <= 0) {
            throw new common_1.BadRequestException("quantity must be greater than 0");
        }
        return this.applyStockDelta(productId, quantity, em);
    }
    async decreaseStock(productId, quantity, em) {
        if (quantity <= 0) {
            throw new common_1.BadRequestException("quantity must be greater than 0");
        }
        return this.applyStockDelta(productId, -quantity, em);
    }
    async applyStockDelta(productId, delta, em) {
        if (!Number.isFinite(delta) || delta === 0) {
            throw new common_1.BadRequestException("Invalid stock delta");
        }
        const manager = em ?? this.productsRepo.manager;
        const apply = async (tx) => {
            const product = await tx.findOne(product_entity_1.Product, {
                where: { id: productId },
                lock: { mode: "pessimistic_write" },
            });
            if (!product) {
                throw new common_1.NotFoundException(`Product ${productId} not found`);
            }
            const next = parseStock(product.stock) + delta;
            if (next < 0) {
                throw new common_1.BadRequestException(`Insufficient stock for product ${productId} (${product.name}). Available: ${parseStock(product.stock)}, requested: ${Math.abs(delta)}`);
            }
            product.stock = dec2(next);
            return tx.save(product);
        };
        if (em) {
            return apply(em);
        }
        return manager.transaction((tx) => apply(tx));
    }
    dtoToEntity(dto) {
        return {
            name: dto.name,
            sku: dto.sku,
            category: dto.category ?? null,
            unit: dto.unit ?? "قطعة",
            price: dec2(dto.price),
            stock: dec2(dto.stock),
            cost: dto.cost != null && !Number.isNaN(dto.cost)
                ? dec2(dto.cost)
                : null,
            active: true,
        };
    }
    applyDto(product, dto) {
        product.name = dto.name;
        product.sku = dto.sku;
        product.category = dto.category ?? null;
        product.unit = dto.unit ?? "قطعة";
        product.price = dec2(dto.price);
        product.stock = dec2(dto.stock);
        product.cost =
            dto.cost != null && !Number.isNaN(dto.cost)
                ? dec2(dto.cost)
                : null;
    }
    async update(id, dto) {
        const product = await this.productsRepo.findOne({ where: { id } });
        if (!product) {
            throw new common_1.NotFoundException("Product not found");
        }
        if (dto.sku && dto.sku !== product.sku) {
            const existing = await this.productsRepo.findOne({
                where: { sku: dto.sku },
            });
            if (existing) {
                throw new common_1.ConflictException("Product SKU already exists");
            }
        }
        if (dto.name !== undefined)
            product.name = dto.name;
        if (dto.sku !== undefined)
            product.sku = dto.sku;
        if (dto.category !== undefined)
            product.category = dto.category;
        if (dto.unit !== undefined)
            product.unit = dto.unit;
        if (dto.price !== undefined)
            product.price = dec2(dto.price);
        if (dto.stock !== undefined)
            product.stock = dec2(dto.stock);
        if (dto.cost !== undefined) {
            product.cost =
                dto.cost != null && !Number.isNaN(dto.cost)
                    ? dec2(dto.cost)
                    : null;
        }
        if (dto.active !== undefined)
            product.active = dto.active;
        return this.productsRepo.save(product);
    }
    async softDelete(id) {
        const product = await this.productsRepo.findOne({ where: { id } });
        if (!product) {
            throw new common_1.NotFoundException("Product not found");
        }
        product.active = false;
        await this.productsRepo.save(product);
        return { id: product.id, active: product.active };
    }
    async distinctCategories() {
        const rows = await this.productsRepo
            .createQueryBuilder("p")
            .select("p.category", "category")
            .where("p.category IS NOT NULL")
            .andWhere("p.category != ''")
            .distinct(true)
            .getRawMany();
        return rows.map((r) => r.category).filter(Boolean);
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ProductsService);
//# sourceMappingURL=products.service.js.map