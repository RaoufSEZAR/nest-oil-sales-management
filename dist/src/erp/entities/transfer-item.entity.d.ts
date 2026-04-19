import { InventoryTransfer } from "src/erp/entities/inventory-transfer.entity";
import { Product } from "src/products/entities/product.entity";
export declare class TransferItem {
    id: number;
    transfer: InventoryTransfer;
    product: Product;
    quantity: string;
    receivedQuantity?: string | null;
    conditionNotes?: string | null;
}
