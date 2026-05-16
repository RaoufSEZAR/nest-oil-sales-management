import { Repository } from "typeorm";
import { Inventory, Product } from "src/products/entities/product.entity";
import { InventoryLocationType } from "src/products/enums/inventory-location-type.enum";
export interface InventoryListFilters {
    locationType?: InventoryLocationType;
    locationId?: number;
}
export declare class InventoryService {
    private readonly inventoryRepo;
    private readonly productRepo;
    constructor(inventoryRepo: Repository<Inventory>, productRepo: Repository<Product>);
    findByLocation(filters: InventoryListFilters): Promise<{
        inventory: Inventory[];
        stats: {
            total_items: number;
            total_value: number;
            low_stock_items: number;
        };
    }>;
    findByProduct(productId: number): Promise<{
        product: Product;
        warehouse_stock: number;
        locations: Inventory[];
    }>;
    updateQuantity(productId: number, locationType: InventoryLocationType, locationId: number, quantity: number): Promise<Inventory>;
    getLowStockAlerts(threshold?: number): Promise<{
        alerts: Inventory[];
        count: number;
    }>;
}
