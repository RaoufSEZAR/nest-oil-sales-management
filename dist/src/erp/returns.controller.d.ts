import { ErpReturnsService } from "src/erp/returns.service";
import { CreateSalesReturnDto } from "src/erp/dto/documents.dto";
export declare class ErpReturnsController {
    private readonly returns;
    constructor(returns: ErpReturnsService);
    findAll(): Promise<import("./entities/sales-return.entity").SalesReturn[]>;
    findOne(id: number): Promise<import("./entities/sales-return.entity").SalesReturn>;
    create(dto: CreateSalesReturnDto): Promise<import("./entities/sales-return.entity").SalesReturn>;
}
