import { Repository } from "typeorm";
import { CashHandover } from "src/erp/entities/cash-handover.entity";
import { CreateCashHandoverDto, UpdateCashHandoverDto } from "src/erp/dto/documents.dto";
import { SequenceService } from "src/erp/sequence.service";
export declare class ErpCashHandoversService {
    private readonly repo;
    private readonly sequences;
    constructor(repo: Repository<CashHandover>, sequences: SequenceService);
    findAll(): Promise<CashHandover[]>;
    findOne(id: number): Promise<CashHandover>;
    create(dto: CreateCashHandoverDto): Promise<CashHandover>;
    update(id: number, dto: UpdateCashHandoverDto): Promise<CashHandover>;
}
