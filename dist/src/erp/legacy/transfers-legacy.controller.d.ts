import { ErpInventoryTransfersService } from "src/erp/inventory-transfers.service";
import { CreateInventoryTransferDto, UpdateInventoryTransferDto } from "src/erp/dto/documents.dto";
export declare class TransfersLegacyController {
    private readonly transfers;
    constructor(transfers: ErpInventoryTransfersService);
    findAll(): Promise<import("../entities/inventory-transfer.entity").InventoryTransfer[]>;
    findOne(id: number): Promise<import("../entities/inventory-transfer.entity").InventoryTransfer>;
    create(dto: CreateInventoryTransferDto): Promise<import("../entities/inventory-transfer.entity").InventoryTransfer>;
    complete(id: number): Promise<import("../entities/inventory-transfer.entity").InventoryTransfer>;
    cancel(id: number): Promise<import("../entities/inventory-transfer.entity").InventoryTransfer>;
    update(id: number, dto: UpdateInventoryTransferDto): Promise<import("../entities/inventory-transfer.entity").InventoryTransfer>;
}
