import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsWhere, Repository } from "typeorm";
import { dateRangeWhere } from "src/common/utils/query-filters";
import { Expense } from "src/erp/entities/expense.entity";
import { CreateExpenseDto } from "src/erp/dto/documents.dto";
import { SequenceService } from "src/erp/sequence.service";
import { TradeCurrency } from "src/erp/enums/trade-currency.enum";
import { User } from "src/users/entities/user.entity";
import { ErpExpenseCategoriesService } from "src/erp/expense-categories.service";

function dec4(n: number): string {
	return n.toFixed(4);
}

@Injectable()
export class ErpExpensesService {
	constructor(
		@InjectRepository(Expense)
		private readonly repo: Repository<Expense>,
		private readonly sequences: SequenceService,
		private readonly expenseCategories: ErpExpenseCategoriesService,
	) {}

	findAll(filters?: {
		category?: string;
		center_id?: number;
		from_date?: string;
		to_date?: string;
	}): Promise<Expense[]> {
		const where: FindOptionsWhere<Expense> = {};
		if (filters?.category) where.category = filters.category;
		if (filters?.center_id) where.center = { id: filters.center_id };
		const dateFilter = dateRangeWhere(filters?.from_date, filters?.to_date);
		if (dateFilter) where.date = dateFilter;

		return this.repo.find({
			where,
			order: { id: "DESC" },
			relations: { center: true, paidBy: true },
		});
	}

	async getCategories(): Promise<string[]> {
		return this.expenseCategories.getActiveNames();
	}

	async remove(id: number): Promise<void> {
		await this.findOne(id);
		await this.repo.delete(id);
	}

	async findOne(id: number): Promise<Expense> {
		const row = await this.repo.findOne({
			where: { id },
			relations: { center: true, paidBy: true },
		});
		if (!row) throw new NotFoundException(`Expense ${id} not found`);
		return row;
	}

	async create(dto: CreateExpenseDto): Promise<Expense> {
		const currency = dto.currency ?? TradeCurrency.USD;
		const exchangeRate = dto.exchangeRate ?? 1;
		const amountUsd = dto.amount * exchangeRate;
		const expenseNumber = await this.sequences.next("EXP");
		const entity = this.repo.create({
			expenseNumber,
			center: dto.centerId ? { id: dto.centerId } : undefined,
			category: dto.category,
			description: dto.description ?? null,
			amount: dec4(dto.amount),
			currency,
			exchangeRate: dec4(exchangeRate),
			amountUsd: dec4(amountUsd),
			date: dto.date.slice(0, 10),
			paidBy: { id: dto.paidById } as User,
			notes: dto.notes ?? null,
		});
		return this.repo.save(entity);
	}
}
