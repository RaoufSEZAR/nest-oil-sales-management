import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CurrencyExchange } from "src/erp/entities/currency-exchange.entity";
import { CreateCurrencyExchangeDto } from "src/erp/dto/documents.dto";
import { SequenceService } from "src/erp/sequence.service";
import { User } from "src/users/entities/user.entity";

function dec4(n: number): string {
	return n.toFixed(4);
}

@Injectable()
export class ErpCurrencyExchangesService {
	constructor(
		@InjectRepository(CurrencyExchange)
		private readonly repo: Repository<CurrencyExchange>,
		private readonly sequences: SequenceService,
	) {}

	findAll(): Promise<CurrencyExchange[]> {
		return this.repo.find({
			order: { id: "DESC" },
			relations: { center: true, createdBy: true },
		});
	}

	async findOne(id: number): Promise<CurrencyExchange> {
		const row = await this.repo.findOne({
			where: { id },
			relations: { center: true, createdBy: true },
		});
		if (!row) throw new NotFoundException(`Currency exchange ${id} not found`);
		return row;
	}

	async create(dto: CreateCurrencyExchangeDto): Promise<CurrencyExchange> {
		const exchangeNumber = await this.sequences.next("EXG");
		const entity = this.repo.create({
			exchangeNumber,
			center: { id: dto.centerId },
			fromCurrency: dto.fromCurrency,
			fromAmount: dec4(dto.fromAmount),
			fromAmountUsd: dec4(dto.fromAmountUsd),
			toCurrency: dto.toCurrency,
			toAmount: dec4(dto.toAmount),
			toAmountUsd: dec4(dto.toAmountUsd),
			exchangeRate: dec4(dto.exchangeRate),
			fromWeightedRate: dec4(dto.fromWeightedRate ?? 1),
			toWeightedRate: dec4(dto.toWeightedRate ?? 1),
			differenceUsd: dec4(dto.differenceUsd ?? 0),
			notes: dto.notes ?? null,
			createdBy: { id: dto.createdById } as User,
		});
		return this.repo.save(entity);
	}
}
