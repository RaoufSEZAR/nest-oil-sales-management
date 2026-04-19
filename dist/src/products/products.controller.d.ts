import { ProductsService } from "src/products/products.service";
import { CreateProductDto } from "src/products/dto/create-product.dto";
import { UpdateProductDto } from "src/products/dto/update-product.dto";
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    getCategories(): Promise<string[]>;
    findAll(search?: string, category?: string, activeRaw?: string, pageRaw?: string, limitRaw?: string): Promise<import("src/products/products.service").ProductsListResult>;
    findOne(id: number): Promise<import("./entities/product.entity").Product>;
    create(dto: CreateProductDto): Promise<import("./entities/product.entity").Product>;
    update(id: number, dto: UpdateProductDto): Promise<import("./entities/product.entity").Product>;
    remove(id: number): Promise<{
        id: number;
        active: boolean;
    }>;
}
