import { SalesReturnStatus } from "src/erp/enums/sales-return-status.enum";
import { ErpReturnsService } from "src/erp/returns.service";
import { CreateSalesReturnDto } from "src/erp/dto/documents.dto";
export declare class ErpReturnsController {
    private readonly returns;
    constructor(returns: ErpReturnsService);
    getReport(from_date?: string, to_date?: string, status?: SalesReturnStatus): Promise<{
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
        returns: import("./entities/sales-return.entity").SalesReturn[];
    }>;
    findAll(customer_id?: string, sales_rep_id?: string, status?: SalesReturnStatus, from_date?: string, to_date?: string): Promise<import("./entities/sales-return.entity").SalesReturn[]>;
    findOne(id: number): Promise<import("./entities/sales-return.entity").SalesReturn>;
    create(dto: CreateSalesReturnDto): Promise<import("./entities/sales-return.entity").SalesReturn>;
    updateStatus(id: number, body: {
        status: SalesReturnStatus;
        manager_notes?: string;
    }): Promise<import("./entities/sales-return.entity").SalesReturn>;
}
