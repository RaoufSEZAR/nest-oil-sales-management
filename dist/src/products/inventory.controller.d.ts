import { UserRole } from "src/users/enums/user-role.enum";
import { InventoryService } from "src/products/inventory.service";
import { InventoryLocationType } from "src/products/enums/inventory-location-type.enum";
import { UsersService } from "src/users/users.service";
export declare class InventoryController {
    private readonly inventory;
    private readonly usersService;
    constructor(inventory: InventoryService, usersService: UsersService);
    getInventory(locationType?: InventoryLocationType, locationIdRaw?: string, req?: {
        user: {
            userId: string;
            role: UserRole;
        };
    }): Promise<{
        inventory: import("./entities/product.entity").Inventory[];
        stats: {
            total_items: number;
            total_value: number;
            low_stock_items: number;
        };
    }>;
    getLowStockAlerts(thresholdRaw?: string): Promise<{
        alerts: import("./entities/product.entity").Inventory[];
        count: number;
    }>;
    getProductInventory(productId: number): Promise<{
        product: import("./entities/product.entity").Product;
        warehouse_stock: number;
        locations: import("./entities/product.entity").Inventory[];
    }>;
    updateInventory(productId: number, body: {
        location_type: InventoryLocationType;
        location_id: number;
        quantity: number;
    }): Promise<import("./entities/product.entity").Inventory>;
}
