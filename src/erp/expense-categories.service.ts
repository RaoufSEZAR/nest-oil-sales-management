import {
	ConflictException,
	Injectable,
	NotFoundException,
	OnModuleInit,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ExpenseCategory } from "src/erp/entities/expense-category.entity";
import { Expense } from "src/erp/entities/expense.entity";
import {
	CreateExpenseCategoryDto,
	UpdateExpenseCategoryDto,
} from "src/erp/dto/expense-category.dto";

const DEFAULT_CATEGORIES = [
	"رواتب",
	"إيجار",
	"وقود",
	"صيانة",
	"دفعة مورد",
	"متنوع",
];

@Injectable()
export class ErpExpenseCategoriesService implements OnModuleInit {
	constructor(
		@InjectRepository(ExpenseCategory)
		private readonly categories: Repository<ExpenseCategory>,
		@InjectRepository(Expense)
		private readonly expenses: Repository<Expense>,
	) {}

	async onModuleInit(): Promise<void> {
		const count = await this.categories.count();
		if (count > 0) return;
		for (let i = 0; i < DEFAULT_CATEGORIES.length; i++) {
			await this.categories.save(
				this.categories.create({
					name: DEFAULT_CATEGORIES[i],
					sortOrder: i,
					active: true,
				}),
			);
		}
	}

	findAll(includeInactive = false): Promise<ExpenseCategory[]> {
		return this.categories.find({
			where: includeInactive ? {} : { active: true },
			order: { sortOrder: "ASC", name: "ASC" },
		});
	}

	findAllForAdmin(): Promise<ExpenseCategory[]> {
		return this.categories.find({
			order: { sortOrder: "ASC", name: "ASC" },
		});
	}

	getActiveNames(): Promise<string[]> {
		return this.findAll(false).then((rows) => rows.map((r) => r.name));
	}

	async findOne(id: number): Promise<ExpenseCategory> {
		const row = await this.categories.findOne({ where: { id } });
		if (!row) throw new NotFoundException(`Expense category ${id} not found`);
		return row;
	}

	async create(dto: CreateExpenseCategoryDto): Promise<ExpenseCategory> {
		const name = dto.name.trim();
		const existing = await this.categories.findOne({ where: { name } });
		if (existing) {
			throw new ConflictException(`Category "${name}" already exists`);
		}
		const entity = this.categories.create({
			name,
			description: dto.description?.trim() || null,
			sortOrder: dto.sortOrder ?? 0,
			active: dto.active ?? true,
		});
		return this.categories.save(entity);
	}

	async update(
		id: number,
		dto: UpdateExpenseCategoryDto,
	): Promise<ExpenseCategory> {
		const row = await this.findOne(id);
		const prevName = row.name;

		if (dto.name !== undefined) {
			const name = dto.name.trim();
			if (name !== row.name) {
				const dup = await this.categories.findOne({ where: { name } });
				if (dup && dup.id !== id) {
					throw new ConflictException(`Category "${name}" already exists`);
				}
				row.name = name;
			}
		}
		if (dto.description !== undefined) {
			row.description = dto.description?.trim() || null;
		}
		if (dto.sortOrder !== undefined) row.sortOrder = dto.sortOrder;
		if (dto.active !== undefined) row.active = dto.active;

		const saved = await this.categories.save(row);

		if (dto.name !== undefined && prevName !== saved.name) {
			await this.expenses.update({ category: prevName }, { category: saved.name });
		}

		return saved;
	}

	async remove(id: number): Promise<void> {
		const row = await this.findOne(id);
		const inUse = await this.expenses.count({
			where: { category: row.name },
		});
		if (inUse > 0) {
			throw new ConflictException(
				`Cannot delete category "${row.name}" — used by ${inUse} expense(s)`,
			);
		}
		await this.categories.delete(id);
	}
}
