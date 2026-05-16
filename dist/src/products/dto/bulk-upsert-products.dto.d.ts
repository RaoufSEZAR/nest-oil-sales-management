import { CreateProductDto } from "src/products/dto/create-product.dto";
export declare class BulkUpsertProductsDto {
    products: CreateProductDto[];
    updateExisting?: boolean;
}
