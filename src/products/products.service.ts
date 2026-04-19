import {
	BadRequestException,
	ConflictException,
	Injectable,
	NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Product } from "src/products/entities/product.entity";
import { CreateProductDto } from "src/products/dto/create-product.dto";
import { UpdateProductDto } from "src/products/dto/update-product.dto";

export interface ProductsListResult {
	products: Product[];
	pagination: {
		total: number;
		page: number;
		limit: number;
		pages: number;
	};
}

@Injectable()
export class ProductsService {
	constructor(
		@InjectRepository(Product)
		private readonly productsRepo: Repository<Product>,
	) {}

	async findAll(params: {
		search?: string;
		category?: string;
		active?: boolean;
		page?: number;
		limit?: number;
	}): Promise<ProductsListResult> {
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

	async findOne(id: number): Promise<Product> {
		const product = await this.productsRepo.findOne({
			where: { id },
			relations: { inventory: true },
		});
		if (!product) {
			throw new NotFoundException("Product not found");
		}
		return product;
	}

	async create(dto: CreateProductDto): Promise<Product> {
		const existing = await this.productsRepo.findOne({
			where: { sku: dto.sku },
		});
		if (existing) {
			throw new ConflictException("Product SKU already exists");
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

	async update(id: number, dto: UpdateProductDto): Promise<Product> {
		const product = await this.productsRepo.findOne({ where: { id } });
		if (!product) {
			throw new NotFoundException("Product not found");
		}
		if (dto.sku && dto.sku !== product.sku) {
			const existing = await this.productsRepo.findOne({
				where: { sku: dto.sku },
			});
			if (existing) {
				throw new ConflictException("Product SKU already exists");
			}
		}

		if (dto.name !== undefined) product.name = dto.name;
		if (dto.sku !== undefined) product.sku = dto.sku;
		if (dto.category !== undefined) product.category = dto.category;
		if (dto.unit !== undefined) product.unit = dto.unit;
		if (dto.price !== undefined) product.price = dto.price.toFixed(2);
		if (dto.cost !== undefined) {
			product.cost =
				dto.cost != null && !Number.isNaN(dto.cost)
					? dto.cost.toFixed(2)
					: null;
		}
		if (dto.active !== undefined) product.active = dto.active;

		return this.productsRepo.save(product);
	}

	async softDelete(id: number): Promise<{ id: number; active: boolean }> {
		const product = await this.productsRepo.findOne({ where: { id } });
		if (!product) {
			throw new NotFoundException("Product not found");
		}
		product.active = false;
		await this.productsRepo.save(product);
		return { id: product.id, active: product.active };
	}

	async distinctCategories(): Promise<string[]> {
		const rows = await this.productsRepo
			.createQueryBuilder("p")
			.select("p.category", "category")
			.where("p.category IS NOT NULL")
			.andWhere("p.category != ''")
			.distinct(true)
			.getRawMany<{ category: string }>();
		return rows.map((r) => r.category).filter(Boolean);
	}
}
