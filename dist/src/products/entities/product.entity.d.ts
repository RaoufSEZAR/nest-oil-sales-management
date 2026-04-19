import { InventoryLocationType } from "src/products/enums/inventory-location-type.enum";
export declare class Product {
    id: number;
    name: string;
    sku: string;
    category?: string | null;
    unit: string;
    price: string;
    cost?: string | null;
    active: boolean;
    inventory: Inventory[];
    createdAt: Date;
    updatedAt: Date;
}
export declare class Inventory {
    id: number;
    productId: number;
    product: Product;
    locationType: InventoryLocationType;
    locationId: number;
    quantity: string;
    lastUpdated: Date;
}
