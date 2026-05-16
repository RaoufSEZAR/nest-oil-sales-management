import { InvoicePaymentStatus } from "src/erp/enums/invoice-payment-status.enum";
import { ErpInvoicesService } from "src/erp/invoices.service";
import { CreateInvoiceDto } from "src/erp/dto/documents.dto";
export declare class ErpInvoicesController {
    private readonly invoices;
    constructor(invoices: ErpInvoicesService);
    findAll(customer_id?: string, sales_rep_id?: string, from_date?: string, to_date?: string, payment_status?: InvoicePaymentStatus): Promise<import("./entities/invoice.entity").Invoice[]>;
    findOne(id: number): Promise<import("./entities/invoice.entity").Invoice>;
    create(dto: CreateInvoiceDto): Promise<import("./entities/invoice.entity").Invoice>;
    update(id: number, body: {
        paidAmount?: number;
        paymentStatus?: InvoicePaymentStatus;
        notes?: string;
    }): Promise<import("./entities/invoice.entity").Invoice>;
    remove(id: number): Promise<void>;
}
