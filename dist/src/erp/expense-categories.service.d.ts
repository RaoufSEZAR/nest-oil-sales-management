import { OnModuleInit } from "@nestjs/common";
import { Repository } from "typeorm";
import { ExpenseCategory } from "src/erp/entities/expense-category.entity";
import { Expense } from "src/erp/entities/expense.entity";
import { CreateExpenseCategoryDto, UpdateExpenseCategoryDto } from "src/erp/dto/expense-category.dto";
export declare class ErpExpenseCategoriesService implements OnModuleInit {
    private readonly categories;
    private readonly expenses;
    constructor(categories: Repository<ExpenseCategory>, expenses: Repository<Expense>);
    onModuleInit(): Promise<void>;
    findAll(includeInactive?: boolean): Promise<ExpenseCategory[]>;
    findAllForAdmin(): Promise<ExpenseCategory[]>;
    getActiveNames(): Promise<string[]>;
    findOne(id: number): Promise<ExpenseCategory>;
    create(dto: CreateExpenseCategoryDto): Promise<ExpenseCategory>;
    update(id: number, dto: UpdateExpenseCategoryDto): Promise<ExpenseCategory>;
    remove(id: number): Promise<void>;
}
