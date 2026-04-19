import { DataSource, Repository } from "typeorm";
import { Invoice } from "src/erp/entities/invoice.entity";
import { CreateInvoiceDto } from "src/erp/dto/documents.dto";
import { SequenceService } from "src/erp/sequence.service";
export declare class ErpInvoicesService {
    private readonly invoices;
    private readonly dataSource;
    private readonly sequences;
    constructor(invoices: Repository<Invoice>, dataSource: DataSource, sequences: SequenceService);
    findAll(): Promise<Invoice[]>;
    findOne(id: number): Promise<Invoice>;
    create(dto: CreateInvoiceDto): Promise<Invoice>;
}
