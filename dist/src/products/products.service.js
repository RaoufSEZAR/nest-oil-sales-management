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
        const product = this.productsRepo.create({
            name: dto.name,
            sku: dto.sku,
            category: dto.category ?? null,
            unit: dto.unit ?? "قطعة",
            price: dto.price.toFixed(2),
            cost: dto.cost != null ? dto.cost.toFixed(2) : null,
            active: true,
        });
        return this.productsRepo.save(product);
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
            product.price = dto.price.toFixed(2);
        if (dto.cost !== undefined) {
            product.cost =
                dto.cost != null && !Number.isNaN(dto.cost)
                    ? dto.cost.toFixed(2)
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