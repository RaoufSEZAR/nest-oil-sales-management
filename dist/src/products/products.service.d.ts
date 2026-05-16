import { EntityManager, Repository } from "typeorm";
import { Product } from "src/products/entities/product.entity";
import { CreateProductDto } from "src/products/dto/create-product.dto";
import { UpdateProductDto } from "src/products/dto/update-product.dto";
import { BulkUpsertProductsResultDto } from "src/products/dto/bulk-upsert-result.dto";
export interface ProductsListResult {
    products: Product[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        pages: number;
    };
}
export declare class ProductsService {
    private readonly productsRepo;
    constructor(productsRepo: Repository<Product>);
    findAll(params: {
        search?: string;
        category?: string;
        active?: boolean;
        page?: number;
        limit?: number;
    }): Promise<ProductsListResult>;
    findOne(id: number): Promise<Product>;
    create(dto: CreateProductDto): Promise<Product>;
    bulkUpsert(items: CreateProductDto[], updateExisting?: boolean): Promise<BulkUpsertProductsResultDto>;
    increaseStock(productId: number, quantity: number, em?: EntityManager): Promise<Product>;
    decreaseStock(productId: number, quantity: number, em?: EntityManager): Promise<Product>;
    applyStockDelta(productId: number, delta: number, em?: EntityManager): Promise<Product>;
    private dtoToEntity;
    private applyDto;
    update(id: number, dto: UpdateProductDto): Promise<Product>;
    softDelete(id: number): Promise<{
        id: number;
        active: boolean;
    }>;
    distinctCategories(): Promise<string[]>;
}
