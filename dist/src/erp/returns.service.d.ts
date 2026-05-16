import { DataSource, Repository } from "typeorm";
import { SalesReturnStatus } from "src/erp/enums/sales-return-status.enum";
import { SalesReturn } from "src/erp/entities/sales-return.entity";
import { CreateSalesReturnDto } from "src/erp/dto/documents.dto";
import { SequenceService } from "src/erp/sequence.service";
import { ProductsService } from "src/products/products.service";
export declare class ErpReturnsService {
    private readonly returns;
    private readonly dataSource;
    private readonly sequences;
    private readonly productsService;
    constructor(returns: Repository<SalesReturn>, dataSource: DataSource, sequences: SequenceService, productsService: ProductsService);
    findAll(filters?: {
        customer_id?: number;
        sales_rep_id?: string;
        return_type?: string;
        status?: SalesReturnStatus;
        from_date?: string;
        to_date?: string;
    }): Promise<SalesReturn[]>;
    findOne(id: number): Promise<SalesReturn>;
    create(dto: CreateSalesReturnDto): Promise<SalesReturn>;
    updateStatus(id: number, status: SalesReturnStatus, managerNotes?: string): Promise<SalesReturn>;
    getReport(filters?: {
        from_date?: string;
        to_date?: string;
        status?: SalesReturnStatus;
    }): Promise<{
        stats: {
            total_returns: number;
            total_amount: number;
            total_items: number;
        };
        by_product: {
            product_id: number;
            name: string;
            total_qty: number;
            total_amount: number;
        }[];
        returns: SalesReturn[];
    }>;
}
