import { ProductsService } from "src/products/products.service";
import { CreateProductDto } from "src/products/dto/create-product.dto";
import { UpdateProductDto } from "src/products/dto/update-product.dto";
import { BulkUpsertProductsDto } from "src/products/dto/bulk-upsert-products.dto";
import { BulkUpsertProductsResultDto } from "src/products/dto/bulk-upsert-result.dto";
import { AdjustProductStockDto } from "src/products/dto/adjust-product-stock.dto";
import { Product } from "src/products/entities/product.entity";
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    getCategories(): Promise<string[]>;
    findAll(search?: string, category?: string, activeRaw?: string, pageRaw?: string, limitRaw?: string): Promise<import("src/products/products.service").ProductsListResult>;
    bulkUpsert(dto: BulkUpsertProductsDto): Promise<BulkUpsertProductsResultDto>;
    seedOilCatalog(updateExistingRaw?: string): Promise<BulkUpsertProductsResultDto>;
    create(dto: CreateProductDto): Promise<Product>;
    findOne(id: number): Promise<Product>;
    increaseStock(id: number, dto: AdjustProductStockDto): Promise<Product>;
    decreaseStock(id: number, dto: AdjustProductStockDto): Promise<Product>;
    update(id: number, dto: UpdateProductDto): Promise<Product>;
    remove(id: number): Promise<{
        id: number;
        active: boolean;
    }>;
}
