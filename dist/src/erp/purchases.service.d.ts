import { DataSource, Repository } from "typeorm";
import { Purchase } from "src/erp/entities/purchase.entity";
import { PurchaseDistribution } from "src/erp/entities/purchase-distribution.entity";
import { CreatePurchaseDto, CreatePurchaseDistributionDto, UpdatePurchaseDto } from "src/erp/dto/documents.dto";
import { SequenceService } from "src/erp/sequence.service";
import { ProductsService } from "src/products/products.service";
export declare class ErpPurchasesService {
    private readonly purchases;
    private readonly distributions;
    private readonly dataSource;
    private readonly sequences;
    private readonly productsService;
    constructor(purchases: Repository<Purchase>, distributions: Repository<PurchaseDistribution>, dataSource: DataSource, sequences: SequenceService, productsService: ProductsService);
    findAll(): Promise<Purchase[]>;
    findOne(id: number): Promise<Purchase>;
    create(dto: CreatePurchaseDto): Promise<Purchase>;
    update(id: number, dto: UpdatePurchaseDto): Promise<Purchase>;
    addDistribution(purchaseId: number, dto: CreatePurchaseDistributionDto): Promise<PurchaseDistribution>;
}
