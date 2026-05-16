import { DataSource, Repository } from "typeorm";
import { InventoryTransfer } from "src/erp/entities/inventory-transfer.entity";
import { TransferItem } from "src/erp/entities/transfer-item.entity";
import { CreateInventoryTransferDto, UpdateInventoryTransferDto } from "src/erp/dto/documents.dto";
import { SequenceService } from "src/erp/sequence.service";
import { ProductsService } from "src/products/products.service";
export declare class ErpInventoryTransfersService {
    private readonly transfers;
    private readonly items;
    private readonly sequences;
    private readonly dataSource;
    private readonly productsService;
    constructor(transfers: Repository<InventoryTransfer>, items: Repository<TransferItem>, sequences: SequenceService, dataSource: DataSource, productsService: ProductsService);
    findAll(): Promise<InventoryTransfer[]>;
    findOne(id: number): Promise<InventoryTransfer>;
    create(dto: CreateInventoryTransferDto): Promise<InventoryTransfer>;
    update(id: number, dto: UpdateInventoryTransferDto): Promise<InventoryTransfer>;
    complete(id: number): Promise<InventoryTransfer>;
    cancel(id: number): Promise<InventoryTransfer>;
}
