import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { Purchase } from "src/erp/entities/purchase.entity";
import { PurchaseItem } from "src/erp/entities/purchase-item.entity";
import { PurchaseDistribution } from "src/erp/entities/purchase-distribution.entity";
import {
	CreatePurchaseDto,
	CreatePurchaseDistributionDto,
	UpdatePurchaseDto,
} from "src/erp/dto/documents.dto";
import { SequenceService } from "src/erp/sequence.service";
import { TradeCurrency } from "src/erp/enums/trade-currency.enum";
import { User } from "src/users/entities/user.entity";

function dec4(n: number): string {
	return n.toFixed(4);
}

@Injectable()
export class ErpPurchasesService {
	constructor(
		@InjectRepository(Purchase)
		private readonly purchases: Repository<Purchase>,
		@InjectRepository(PurchaseDistribution)
		private readonly distributions: Repository<PurchaseDistribution>,
		private readonly dataSource: DataSource,
		private readonly sequences: SequenceService,
	) {}

	findAll(): Promise<Purchase[]> {
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

	async findOne(id: number): Promise<Purchase> {
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
		if (!row) throw new NotFoundException(`Purchase ${id} not found`);
		return row;
	}

	async create(dto: CreatePurchaseDto): Promise<Purchase> {
		const currency = dto.currency ?? TradeCurrency.USD;
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
			const pur = em.create(Purchase, {
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
				createdBy: { id: dto.createdById } as User,
				customsCost: dec4(customs),
				shippingCost: dec4(shipping),
				notes: dto.notes ?? null,
			});
			await em.save(pur);

			for (const line of dto.items) {
				const lineTotal = line.quantity * line.unitPriceUsd;
				const item = em.create(PurchaseItem, {
					purchase: { id: pur.id },
					product: line.productId ? { id: line.productId } : null,
					description: line.description ?? null,
					quantity: dec4(line.quantity),
					unitPriceUsd: dec4(line.unitPriceUsd),
					totalUsd: dec4(lineTotal),
				});
				await em.save(item);
			}

			return em.findOneOrFail(Purchase, {
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

	async update(id: number, dto: UpdatePurchaseDto): Promise<Purchase> {
		const row = await this.findOne(id);
		if (dto.supplierName !== undefined) row.supplierName = dto.supplierName;
		if (dto.supplierPhone !== undefined)
			row.supplierPhone = dto.supplierPhone ?? null;
		if (dto.notes !== undefined) row.notes = dto.notes ?? null;
		await this.purchases.save(row);
		return this.findOne(id);
	}

	async addDistribution(
		purchaseId: number,
		dto: CreatePurchaseDistributionDto,
	): Promise<PurchaseDistribution> {
		await this.findOne(purchaseId);
		const entity = this.distributions.create({
			purchase: { id: purchaseId },
			center: { id: dto.centerId },
			product: { id: dto.productId },
			quantity: dec4(dto.quantity),
			distributedBy: dto.distributedById
				? ({ id: dto.distributedById } as User)
				: undefined,
			notes: dto.notes ?? null,
		});
		return this.distributions.save(entity);
	}
}
