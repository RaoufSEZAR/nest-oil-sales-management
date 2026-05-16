import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Between, FindOptionsWhere, Repository } from "typeorm";
import { Payment } from "src/erp/entities/payment.entity";
import { CreatePaymentDto } from "src/erp/dto/documents.dto";
import { SequenceService } from "src/erp/sequence.service";
import { TradeCurrency } from "src/erp/enums/trade-currency.enum";
import { User } from "src/users/entities/user.entity";

function dec4(n: number): string {
	return n.toFixed(4);
}

@Injectable()
export class ErpPaymentsService {
	constructor(
		@InjectRepository(Payment)
		private readonly repo: Repository<Payment>,
		private readonly sequences: SequenceService,
	) {}

	findAll(filters?: {
		customer_id?: number;
		received_by?: string;
		from_date?: string;
		to_date?: string;
	}): Promise<Payment[]> {
		const where: FindOptionsWhere<Payment> = {};
		if (filters?.customer_id) where.customer = { id: filters.customer_id };
		if (filters?.received_by) where.receivedBy = { id: filters.received_by };
		if (filters?.from_date && filters?.to_date) {
			where.paymentDate = Between(
				new Date(filters.from_date),
				new Date(filters.to_date),
			);
		}

		return this.repo.find({
			where,
			order: { id: "DESC" },
			relations: { customer: true, receivedBy: true },
		});
	}

	findByCustomer(customerId: number): Promise<Payment[]> {
		return this.repo.find({
			where: { customer: { id: customerId } },
			order: { paymentDate: "DESC" },
			relations: { customer: true, receivedBy: true },
		});
	}

	async findOne(id: number): Promise<Payment> {
		const row = await this.repo.findOne({
			where: { id },
			relations: { customer: true, receivedBy: true },
		});
		if (!row) throw new NotFoundException(`Payment ${id} not found`);
		return row;
	}

	async create(dto: CreatePaymentDto): Promise<Payment> {
		const currency = dto.currency ?? TradeCurrency.USD;
		const exchangeRate = dto.exchangeRate ?? 1;
		const amountUsd = dto.amount * exchangeRate;
		const paymentNumber = await this.sequences.next("PAY");
		const entity = this.repo.create({
			paymentNumber,
			customer: { id: dto.customerId },
			amount: dec4(dto.amount),
			currency,
			exchangeRate: dec4(exchangeRate),
			amountUsd: dec4(amountUsd),
			paymentMethod: dto.paymentMethod ?? "نقدي",
			paymentDate: new Date(dto.paymentDate),
			receivedBy: { id: dto.receivedById } as User,
			referenceNumber: dto.referenceNumber ?? null,
			notes: dto.notes ?? null,
			relatedInvoices: dto.relatedInvoices ?? null,
			editedOnce: false,
			lastEditAllowedUntil: null,
		});
		return this.repo.save(entity);
	}

	async update(
		id: number,
		dto: Partial<CreatePaymentDto>,
	): Promise<Payment> {
		const row = await this.findOne(id);
		if (dto.amount !== undefined) row.amount = dec4(dto.amount);
		if (dto.currency !== undefined) row.currency = dto.currency;
		if (dto.exchangeRate !== undefined) row.exchangeRate = dec4(dto.exchangeRate);
		if (dto.paymentMethod !== undefined) row.paymentMethod = dto.paymentMethod;
		if (dto.paymentDate !== undefined)
			row.paymentDate = new Date(dto.paymentDate);
		if (dto.referenceNumber !== undefined)
			row.referenceNumber = dto.referenceNumber ?? null;
		if (dto.notes !== undefined) row.notes = dto.notes ?? null;
		if (dto.amount !== undefined || dto.exchangeRate !== undefined) {
			const amount = parseFloat(row.amount);
			const rate = parseFloat(row.exchangeRate);
			row.amountUsd = dec4(amount * rate);
		}
		return this.repo.save(row);
	}

	async remove(id: number): Promise<void> {
		await this.findOne(id);
		await this.repo.delete(id);
	}
}
