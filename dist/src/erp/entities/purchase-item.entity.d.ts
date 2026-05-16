import { Purchase } from "src/erp/entities/purchase.entity";
import { Product } from "src/products/entities/product.entity";
export declare class PurchaseItem {
    id: number;
    purchase: Purchase;
    product?: Product | null;
    description?: string | null;
    quantity: string;
    unitPriceUsd: string;
    totalUsd: string;
    distributedQty: string;
}
