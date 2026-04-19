import { Repository } from "typeorm";
import { Expense } from "src/erp/entities/expense.entity";
import { CreateExpenseDto } from "src/erp/dto/documents.dto";
import { SequenceService } from "src/erp/sequence.service";
export declare class ErpExpensesService {
    private readonly repo;
    private readonly sequences;
    constructor(repo: Repository<Expense>, sequences: SequenceService);
    findAll(): Promise<Expense[]>;
    findOne(id: number): Promise<Expense>;
    create(dto: CreateExpenseDto): Promise<Expense>;
}
