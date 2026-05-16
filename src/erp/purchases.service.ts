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
import { PurchaseReceiptStatus } from "src/erp/enums/purchase-receipt-status.enum";
import { PurchasePaymentStatus } from "src/erp/enums/purchase-payment-status.enum";
import { TradeCurrency } from "src/erp/enums/trade-currency.enum";
import { User } from "src/users/entities/user.entity";
import { ProductsService } from "src/products/products.service";

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
		private readonly productsService: ProductsService,
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
		const paidOrig = dto.paidAmount ?? 0;
		const paidUsd = currency === TradeCurrency.USD ? paidOrig : paidOrig / exchangeRate;

		let paymentStatus = PurchasePaymentStatus.UNPAID;
		if (paidUsd > 0.01 && paidUsd < totalAmount - 0.01) {
			paymentStatus = PurchasePaymentStatus.PARTIAL;
		} else if (paidUsd >= totalAmount - 0.01 && totalAmount > 0) {
			paymentStatus = PurchasePaymentStatus.PAID;
		}

		const purchaseType = dto.purchaseType ?? "center";

		return this.dataSource.transaction(async (em) => {
			const purchaseNumber = await this.sequences.next("PO");
			const pur = em.create(Purchase, {
				purchaseNumber,
				center: dto.centerId ? { id: dto.centerId } : undefined,
				supplierName: dto.supplierName,
				supplierPhone: dto.supplierPhone ?? null,
				date: dto.date.slice(0, 10),
				totalAmount: dec4(totalAmount),
				paidAmount: dec4(paidOrig),
				currency,
				exchangeRate: dec4(exchangeRate),
				amountUsd: dec4(totalAmount * exchangeRate),
				paymentStatus,
				purchaseType,
				distributionStatus:
					purchaseType === "main" ? "pending" : null,
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
				if (line.productId) {
					await this.productsService.increaseStock(
						line.productId,
						line.quantity,
						em,
					);
				}
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
		const saved = await this.distributions.save(entity);
		await this.productsService.decreaseStock(dto.productId, dto.quantity);
		await this.syncDistributionStatus(purchaseId);
		return saved;
	}

	private async syncDistributionStatus(purchaseId: number): Promise<void> {
		const row = await this.findOne(purchaseId);
		if (row.purchaseType !== "main") return;

		const items = row.items ?? [];
		const dists = row.distributions ?? [];
		if (!items.length) {
			row.distributionStatus = "pending";
		} else {
			let fully = true;
			let any = dists.length > 0;
			for (const item of items) {
				if (!item.product?.id) continue;
				const ordered = parseFloat(item.quantity || "0");
				const sent = dists
					.filter((d) => d.product?.id === item.product?.id)
					.reduce((s, d) => s + parseFloat(d.quantity || "0"), 0);
				if (sent < ordered - 0.0001) fully = false;
				if (sent > 0) any = true;
			}
			if (fully && any) row.distributionStatus = "distributed";
			else if (any) row.distributionStatus = "partial";
			else row.distributionStatus = "pending";
		}
		await this.purchases.save(row);
	}

	async confirmReceipt(id: number, confirmedById: string): Promise<Purchase> {
		const row = await this.findOne(id);
		row.receiptStatus = PurchaseReceiptStatus.CONFIRMED;
		row.confirmedBy = { id: confirmedById } as User;
		row.confirmedAt = new Date();
		await this.purchases.save(row);
		return this.findOne(id);
	}

	async rejectReceipt(
		id: number,
		confirmedById: string,
		notes?: string,
	): Promise<Purchase> {
		const row = await this.findOne(id);
		row.receiptStatus = PurchaseReceiptStatus.REJECTED;
		row.confirmedBy = { id: confirmedById } as User;
		row.confirmedAt = new Date();
		if (notes) {
			row.notes = [row.notes, `[reject: ${notes}]`].filter(Boolean).join("\n");
		}
		await this.purchases.save(row);
		return this.findOne(id);
	}

	async updatePayment(
		id: number,
		body: {
			paid_amount: number;
			currency?: string;
			exchange_rate?: number;
		},
	): Promise<Purchase> {
		const row = await this.findOne(id);
		const cur = (body.currency || row.currency || "USD").toUpperCase();
		const rate =
			body.exchange_rate ?? parseFloat(row.exchangeRate || "1");
		const paidOrig = body.paid_amount;
		const paidUsd = cur === "USD" ? paidOrig : paidOrig / rate;
		const totalAmt = parseFloat(row.totalAmount);

		let paymentStatus = PurchasePaymentStatus.UNPAID;
		if (paidUsd > 0.01 && paidUsd < totalAmt - 0.01) {
			paymentStatus = PurchasePaymentStatus.PARTIAL;
		} else if (paidUsd >= totalAmt - 0.01) {
			paymentStatus = PurchasePaymentStatus.PAID;
		}

		row.paidAmount = dec4(paidOrig);
		row.currency = cur as never;
		row.exchangeRate = dec4(rate);
		row.amountUsd = dec4(paidUsd);
		row.paymentStatus = paymentStatus;
		await this.purchases.save(row);
		return this.findOne(id);
	}
}
