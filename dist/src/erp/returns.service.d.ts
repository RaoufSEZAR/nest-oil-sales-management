import { DataSource, Repository } from "typeorm";
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
    findAll(): Promise<SalesReturn[]>;
    findOne(id: number): Promise<SalesReturn>;
    create(dto: CreateSalesReturnDto): Promise<SalesReturn>;
}
