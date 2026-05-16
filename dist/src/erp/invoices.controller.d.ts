import { ErpInvoicesService } from "src/erp/invoices.service";
import { CreateInvoiceDto } from "src/erp/dto/documents.dto";
export declare class ErpInvoicesController {
    private readonly invoices;
    constructor(invoices: ErpInvoicesService);
    findAll(): Promise<import("./entities/invoice.entity").Invoice[]>;
    findOne(id: number): Promise<import("./entities/invoice.entity").Invoice>;
    create(dto: CreateInvoiceDto): Promise<import("./entities/invoice.entity").Invoice>;
}
