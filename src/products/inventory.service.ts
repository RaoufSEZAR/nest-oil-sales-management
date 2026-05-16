import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Inventory, Product } from "src/products/entities/product.entity";
import { InventoryLocationType } from "src/products/enums/inventory-location-type.enum";

export interface InventoryListFilters {
	locationType?: InventoryLocationType;
	locationId?: number;
}

@Injectable()
export class InventoryService {
	constructor(
		@InjectRepository(Inventory)
		private readonly inventoryRepo: Repository<Inventory>,
		@InjectRepository(Product)
		private readonly productRepo: Repository<Product>,
	) {}

	async findByLocation(filters: InventoryListFilters) {
		const where: Record<string, unknown> = {};
		if (filters.locationType) where.locationType = filters.locationType;
		if (filters.locationId) where.locationId = filters.locationId;

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
			if (qty < 10) lowStockItems++;
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

	async findByProduct(productId: number) {
		const product = await this.productRepo.findOne({ where: { id: productId } });
		if (!product) throw new NotFoundException(`Product ${productId} not found`);

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

	async updateQuantity(
		productId: number,
		locationType: InventoryLocationType,
		locationId: number,
		quantity: number,
	) {
		if (quantity < 0) {
			throw new BadRequestException("Quantity cannot be negative");
		}

		let row = await this.inventoryRepo.findOne({
			where: { productId, locationType, locationId },
		});

		if (!row) {
			const product = await this.productRepo.findOne({ where: { id: productId } });
			if (!product) throw new NotFoundException(`Product ${productId} not found`);
			row = this.inventoryRepo.create({
				productId,
				locationType,
				locationId,
				quantity: quantity.toFixed(2),
			});
		} else {
			row.quantity = quantity.toFixed(2);
		}

		return this.inventoryRepo.save(row);
	}

	async getLowStockAlerts(threshold = 10) {
		const rows = await this.inventoryRepo.find({ relations: { product: true } });
		const alerts = rows.filter((r) => parseFloat(r.quantity) < threshold);
		return { alerts, count: alerts.length };
	}
}
