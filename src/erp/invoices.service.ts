import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { Invoice } from "src/erp/entities/invoice.entity";
import { InvoiceItem } from "src/erp/entities/invoice-item.entity";
import { CreateInvoiceDto } from "src/erp/dto/documents.dto";
import { SequenceService } from "src/erp/sequence.service";
import { TradeCurrency } from "src/erp/enums/trade-currency.enum";
import { InvoicePaymentStatus } from "src/erp/enums/invoice-payment-status.enum";
import { User } from "src/users/entities/user.entity";

function dec2(n: number): string {
	return n.toFixed(2);
}

@Injectable()
export class ErpInvoicesService {
	constructor(
		@InjectRepository(Invoice)
		private readonly invoices: Repository<Invoice>,
		private readonly dataSource: DataSource,
		private readonly sequences: SequenceService,
	) {}

	findAll(): Promise<Invoice[]> {
		return this.invoices.find({
			order: { id: "DESC" },
			relations: {
				customer: true,
				salesRep: true,
				trip: true,
				items: { product: true },
			},
		});
	}

	async findOne(id: number): Promise<Invoice> {
		const row = await this.invoices.findOne({
			where: { id },
			relations: {
				customer: true,
				salesRep: true,
				trip: true,
				items: { product: true },
			},
		});
		if (!row) throw new NotFoundException(`Invoice ${id} not found`);
		return row;
	}

	async create(dto: CreateInvoiceDto): Promise<Invoice> {
		const currency = dto.currency ?? TradeCurrency.USD;
		const exchangeRate = dto.exchangeRate ?? 1;
		const discount = dto.discount ?? 0;
		const taxRate = dto.taxRate ?? 0;

		let subtotal = 0;
		for (const line of dto.items) {
			subtotal += line.quantity * line.unitPrice;
		}
		const subAfter = Math.max(subtotal - discount, 0);
		const taxAmount = subAfter * (taxRate / 100);
		const totalAmount = subAfter + taxAmount;

		return this.dataSource.transaction(async (em) => {
			const invoiceNumber = await this.sequences.next("INV");
			const inv = em.create(Invoice, {
				invoiceNumber,
				customer: { id: dto.customerId },
				salesRep: { id: dto.salesRepId } as User,
				date: new Date(dto.date),
				subtotal: dec2(subtotal),
				discount: dec2(discount),
				taxRate: dec2(taxRate),
				taxAmount: dec2(taxAmount),
				totalAmount: dec2(totalAmount),
				paidAmount: "0",
				currency,
				exchangeRate: dec2(exchangeRate),
				paymentStatus: InvoicePaymentStatus.PENDING,
				notes: dto.notes ?? null,
				trip: dto.tripId ? { id: dto.tripId } : undefined,
				editedOnce: false,
				lastEditAllowedUntil: null,
				synced: false,
			});
			await em.save(inv);

			for (const line of dto.items) {
				const lineTotal = line.quantity * line.unitPrice;
				const item = em.create(InvoiceItem, {
					invoice: { id: inv.id },
					product: { id: line.productId },
					quantity: dec2(line.quantity),
					unitPrice: dec2(line.unitPrice),
					total: dec2(lineTotal),
				});
				await em.save(item);
			}

			return em.findOneOrFail(Invoice, {
				where: { id: inv.id },
				relations: {
					customer: true,
					salesRep: true,
					trip: true,
					items: { product: true },
				},
			});
		});
	}
}
