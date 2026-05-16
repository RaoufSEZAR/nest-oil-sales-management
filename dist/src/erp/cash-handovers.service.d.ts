import { Repository } from "typeorm";
import { CashHandover } from "src/erp/entities/cash-handover.entity";
import { CreateCashHandoverDto, UpdateCashHandoverDto } from "src/erp/dto/documents.dto";
import { SequenceService } from "src/erp/sequence.service";
import { CashHandoverStatus } from "src/erp/enums/cash-handover-status.enum";
export declare class ErpCashHandoversService {
    private readonly repo;
    private readonly sequences;
    constructor(repo: Repository<CashHandover>, sequences: SequenceService);
    findAll(): Promise<CashHandover[]>;
    findOne(id: number): Promise<CashHandover>;
    create(dto: CreateCashHandoverDto): Promise<CashHandover>;
    update(id: number, dto: UpdateCashHandoverDto): Promise<CashHandover>;
    confirm(id: number, receivedById?: string): Promise<CashHandover>;
    reject(id: number, notes?: string): Promise<CashHandover>;
    findFiltered(filters?: {
        from_type?: string;
        from_id?: number;
        to_type?: string;
        to_id?: number;
        status?: CashHandoverStatus;
    }): Promise<CashHandover[]>;
}
