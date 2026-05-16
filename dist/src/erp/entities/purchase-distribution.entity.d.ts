import { Purchase } from "src/erp/entities/purchase.entity";
import { Center } from "src/centers/entities/center.entity";
import { Product } from "src/products/entities/product.entity";
import { User } from "src/users/entities/user.entity";
export declare class PurchaseDistribution {
    id: number;
    purchase: Purchase;
    center: Center;
    product: Product;
    quantity: string;
    distributedBy?: User | null;
    distributedAt: Date;
    notes?: string | null;
}
