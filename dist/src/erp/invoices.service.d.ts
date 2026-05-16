import { DataSource, Repository } from "typeorm";
import { Invoice } from "src/erp/entities/invoice.entity";
import { CreateInvoiceDto } from "src/erp/dto/documents.dto";
import { SequenceService } from "src/erp/sequence.service";
import { ProductsService } from "src/products/products.service";
export declare class ErpInvoicesService {
    private readonly invoices;
    private readonly dataSource;
    private readonly sequences;
    private readonly productsService;
    constructor(invoices: Repository<Invoice>, dataSource: DataSource, sequences: SequenceService, productsService: ProductsService);
    findAll(): Promise<Invoice[]>;
    findOne(id: number): Promise<Invoice>;
    create(dto: CreateInvoiceDto): Promise<Invoice>;
}
