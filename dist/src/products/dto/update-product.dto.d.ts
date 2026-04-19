import { CreateProductDto } from "src/products/dto/create-product.dto";
declare const UpdateProductDto_base: import("@nestjs/common").Type<Partial<CreateProductDto>>;
export declare class UpdateProductDto extends UpdateProductDto_base {
    active?: boolean;
}
export {};
