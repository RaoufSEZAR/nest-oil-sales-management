import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
	IsBoolean,
	IsInt,
	IsOptional,
	IsString,
	MaxLength,
} from "class-validator";

export class CreateExpenseCategoryDto {
	@ApiProperty({ example: "رواتب" })
	@IsString()
	@MaxLength(50)
	name: string;

	@ApiPropertyOptional()
	@IsOptional()
	@IsString()
	@MaxLength(255)
	description?: string;

	@ApiPropertyOptional()
	@IsOptional()
	@IsInt()
	@Type(() => Number)
	sortOrder?: number;

	@ApiPropertyOptional()
	@IsOptional()
	@IsBoolean()
	active?: boolean;
}

export class UpdateExpenseCategoryDto {
	@ApiPropertyOptional()
	@IsOptional()
	@IsString()
	@MaxLength(50)
	name?: string;

	@ApiPropertyOptional()
	@IsOptional()
	@IsString()
	@MaxLength(255)
	description?: string;

	@ApiPropertyOptional()
	@IsOptional()
	@IsInt()
	@Type(() => Number)
	sortOrder?: number;

	@ApiPropertyOptional()
	@IsOptional()
	@IsBoolean()
	active?: boolean;
}
