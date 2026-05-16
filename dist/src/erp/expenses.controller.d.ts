import { ErpExpensesService } from "src/erp/expenses.service";
import { CreateExpenseDto } from "src/erp/dto/documents.dto";
export declare class ErpExpensesController {
    private readonly expenses;
    constructor(expenses: ErpExpensesService);
    getCategories(): Promise<string[]>;
    findAll(category?: string, center_id?: string, from_date?: string, to_date?: string): Promise<import("./entities/expense.entity").Expense[]>;
    findOne(id: number): Promise<import("./entities/expense.entity").Expense>;
    create(dto: CreateExpenseDto): Promise<import("./entities/expense.entity").Expense>;
    remove(id: number): Promise<void>;
}
