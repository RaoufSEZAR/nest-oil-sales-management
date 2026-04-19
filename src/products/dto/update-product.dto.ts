import { PartialType } from "@nestjs/swagger";
import { CreateProductDto } from "src/products/dto/create-product.dto";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsOptional } from "class-validator";

export class UpdateProductDto extends PartialType(CreateProductDto) {
	@ApiPropertyOptional()
	@IsOptional()
	@IsBoolean()
	active?: boolean;
}
