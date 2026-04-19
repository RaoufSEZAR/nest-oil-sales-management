import { Repository } from "typeorm";
import { Payment } from "src/erp/entities/payment.entity";
import { CreatePaymentDto } from "src/erp/dto/documents.dto";
import { SequenceService } from "src/erp/sequence.service";
export declare class ErpPaymentsService {
    private readonly repo;
    private readonly sequences;
    constructor(repo: Repository<Payment>, sequences: SequenceService);
    findAll(): Promise<Payment[]>;
    findOne(id: number): Promise<Payment>;
    create(dto: CreatePaymentDto): Promise<Payment>;
}
