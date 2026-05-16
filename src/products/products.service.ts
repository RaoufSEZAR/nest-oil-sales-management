import {
	BadRequestException,
	ConflictException,
	Injectable,
	NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityManager, Repository } from "typeorm";
import { Product } from "src/products/entities/product.entity";
import { CreateProductDto } from "src/products/dto/create-product.dto";
import { UpdateProductDto } from "src/products/dto/update-product.dto";
import { BulkUpsertProductsResultDto } from "src/products/dto/bulk-upsert-result.dto";

export interface ProductsListResult {
	products: Product[];
	pagination: {
		total: number;
		page: number;
		limit: number;
		pages: number;
	};
}

function dec2(n: number): string {
	return n.toFixed(2);
}

function parseStock(value: string | null | undefined): number {
	return Number.parseFloat(value ?? "0") || 0;
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
		const product = this.productsRepo.create(this.dtoToEntity(dto));
		return this.productsRepo.save(product);
	}

	async bulkUpsert(
		items: CreateProductDto[],
		updateExisting = true,
	): Promise<BulkUpsertProductsResultDto> {
		if (!items.length) {
			throw new BadRequestException("products array must not be empty");
		}

		const result: BulkUpsertProductsResultDto = {
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
				} else {
					const product = this.productsRepo.create(this.dtoToEntity(dto));
					await this.productsRepo.save(product);
					result.created++;
				}
			} catch (err: unknown) {
				const message =
					err instanceof Error ? err.message : "Unknown error";
				result.errors.push({ sku: dto.sku, message });
			}
		}

		return result;
	}

	/** Increase stock (purchases, returns, manual adjustment). */
	async increaseStock(
		productId: number,
		quantity: number,
		em?: EntityManager,
	): Promise<Product> {
		if (quantity <= 0) {
			throw new BadRequestException("quantity must be greater than 0");
		}
		return this.applyStockDelta(productId, quantity, em);
	}

	/** Decrease stock (sales, distributions, manual adjustment). */
	async decreaseStock(
		productId: number,
		quantity: number,
		em?: EntityManager,
	): Promise<Product> {
		if (quantity <= 0) {
			throw new BadRequestException("quantity must be greater than 0");
		}
		return this.applyStockDelta(productId, -quantity, em);
	}

	async applyStockDelta(
		productId: number,
		delta: number,
		em?: EntityManager,
	): Promise<Product> {
		if (!Number.isFinite(delta) || delta === 0) {
			throw new BadRequestException("Invalid stock delta");
		}

		const manager = em ?? this.productsRepo.manager;

		const apply = async (tx: EntityManager) => {
			const product = await tx.findOne(Product, {
				where: { id: productId },
				lock: { mode: "pessimistic_write" },
			});
			if (!product) {
				throw new NotFoundException(`Product ${productId} not found`);
			}

			const next = parseStock(product.stock) + delta;
			if (next < 0) {
				throw new BadRequestException(
					`Insufficient stock for product ${productId} (${product.name}). Available: ${parseStock(product.stock)}, requested: ${Math.abs(delta)}`,
				);
			}

			product.stock = dec2(next);
			return tx.save(product);
		};

		if (em) {
			return apply(em);
		}

		return manager.transaction((tx) => apply(tx));
	}

	private dtoToEntity(dto: CreateProductDto): Partial<Product> {
		return {
			name: dto.name,
			sku: dto.sku,
			category: dto.category ?? null,
			unit: dto.unit ?? "قطعة",
			price: dec2(dto.price),
			stock: dec2(dto.stock),
			cost:
				dto.cost != null && !Number.isNaN(dto.cost)
					? dec2(dto.cost)
					: null,
			active: true,
		};
	}

	private applyDto(product: Product, dto: CreateProductDto): void {
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
		if (dto.price !== undefined) product.price = dec2(dto.price);
		if (dto.stock !== undefined) product.stock = dec2(dto.stock);
		if (dto.cost !== undefined) {
			product.cost =
				dto.cost != null && !Number.isNaN(dto.cost)
					? dec2(dto.cost)
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
