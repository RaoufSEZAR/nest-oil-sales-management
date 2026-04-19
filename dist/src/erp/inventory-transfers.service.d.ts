import { Repository } from "typeorm";
import { InventoryTransfer } from "src/erp/entities/inventory-transfer.entity";
import { TransferItem } from "src/erp/entities/transfer-item.entity";
import { CreateInventoryTransferDto, UpdateInventoryTransferDto } from "src/erp/dto/documents.dto";
import { SequenceService } from "src/erp/sequence.service";
export declare class ErpInventoryTransfersService {
    private readonly transfers;
    private readonly items;
    private readonly sequences;
    constructor(transfers: Repository<InventoryTransfer>, items: Repository<TransferItem>, sequences: SequenceService);
    findAll(): Promise<InventoryTransfer[]>;
    findOne(id: number): Promise<InventoryTransfer>;
    create(dto: CreateInventoryTransferDto): Promise<InventoryTransfer>;
    update(id: number, dto: UpdateInventoryTransferDto): Promise<InventoryTransfer>;
}
