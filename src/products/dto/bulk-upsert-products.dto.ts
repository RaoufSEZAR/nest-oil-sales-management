import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
	ArrayMinSize,
	IsArray,
	IsBoolean,
	IsOptional,
	ValidateNested,
} from "class-validator";
import { CreateProductDto } from "src/products/dto/create-product.dto";

export class BulkUpsertProductsDto {
	@ApiProperty({ type: CreateProductDto, isArray: true })
	@IsArray()
	@ArrayMinSize(1)
	@ValidateNested({ each: true })
	@Type(() => CreateProductDto)
	products: CreateProductDto[];

	@ApiPropertyOptional({
		description:
			"When true (default), existing SKUs are updated. When false, existing SKUs are skipped.",
		default: true,
	})
	@IsOptional()
	@IsBoolean()
	updateExisting?: boolean;
}
