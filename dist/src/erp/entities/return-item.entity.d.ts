import { SalesReturn } from "src/erp/entities/sales-return.entity";
import { Product } from "src/products/entities/product.entity";
import { ReturnItemCondition } from "src/erp/enums/return-item-condition.enum";
export declare class ReturnItem {
    id: number;
    salesReturn: SalesReturn;
    product: Product;
    quantity: string;
    unitPrice: string;
    total: string;
    condition: ReturnItemCondition;
    reasonDetail?: string | null;
}
