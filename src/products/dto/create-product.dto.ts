import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
	MaxLength,
	Min,
} from "class-validator";
import { Type } from "class-transformer";

export class CreateProductDto {
	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	@MaxLength(100)
	name: string;

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	@MaxLength(50)
	sku: string;

	@ApiPropertyOptional()
	@IsOptional()
	@IsString()
	@MaxLength(50)
	category?: string;

	@ApiPropertyOptional({ default: "قطعة" })
	@IsOptional()
	@IsString()
	@MaxLength(20)
	unit?: string;

	@ApiProperty()
	@Type(() => Number)
	@IsNumber()
	@Min(0)
	price: number;

	@ApiProperty({
		description: "Available stock quantity (required)",
		minimum: 0,
		example: 500,
	})
	@Type(() => Number)
	@IsNumber()
	@Min(0)
	stock: number;

	@ApiPropertyOptional()
	@IsOptional()
	@Type(() => Number)
	@IsNumber()
	@Min(0)
	cost?: number;
}
