import { Repository } from "typeorm";
import { Expense } from "src/erp/entities/expense.entity";
import { CreateExpenseDto } from "src/erp/dto/documents.dto";
import { SequenceService } from "src/erp/sequence.service";
export declare class ErpExpensesService {
    private readonly repo;
    private readonly sequences;
    constructor(repo: Repository<Expense>, sequences: SequenceService);
    findAll(filters?: {
        category?: string;
        center_id?: number;
        from_date?: string;
        to_date?: string;
    }): Promise<Expense[]>;
    getCategories(): Promise<string[]>;
    remove(id: number): Promise<void>;
    findOne(id: number): Promise<Expense>;
    create(dto: CreateExpenseDto): Promise<Expense>;
}
