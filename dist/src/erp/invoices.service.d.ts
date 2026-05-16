import { DataSource, Repository } from "typeorm";
import { Invoice } from "src/erp/entities/invoice.entity";
import { CreateInvoiceDto } from "src/erp/dto/documents.dto";
import { SequenceService } from "src/erp/sequence.service";
import { InvoicePaymentStatus } from "src/erp/enums/invoice-payment-status.enum";
import { ProductsService } from "src/products/products.service";
export declare class ErpInvoicesService {
    private readonly invoices;
    private readonly dataSource;
    private readonly sequences;
    private readonly productsService;
    constructor(invoices: Repository<Invoice>, dataSource: DataSource, sequences: SequenceService, productsService: ProductsService);
    findAll(filters?: {
        customer_id?: number;
        sales_rep_id?: string;
        from_date?: string;
        to_date?: string;
        payment_status?: InvoicePaymentStatus;
    }): Promise<Invoice[]>;
    findOne(id: number): Promise<Invoice>;
    create(dto: CreateInvoiceDto): Promise<Invoice>;
    update(id: number, patch: {
        paidAmount?: number;
        paymentStatus?: InvoicePaymentStatus;
        notes?: string;
    }): Promise<Invoice>;
    remove(id: number): Promise<void>;
}
