import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
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

	findAll(): Promise<Payment[]> {
		return this.repo.find({
			order: { id: "DESC" },
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
}
