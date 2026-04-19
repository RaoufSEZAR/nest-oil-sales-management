import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import {
	IsOptional,
	IsString,
	IsUUID,
	MaxLength,
	MinLength,
} from "class-validator";

export class CreateCustomerDto {
	@ApiProperty()
	@IsString()
	@MinLength(1)
	@MaxLength(100)
	name: string;

	@ApiProperty()
	@IsString()
	@MinLength(1)
	@MaxLength(20)
	phone: string;

	@ApiPropertyOptional()
	@IsOptional()
	@IsString()
	address?: string;

	@ApiPropertyOptional()
	@IsOptional()
	@IsString()
	@MaxLength(100)
	area?: string;

	@ApiPropertyOptional()
	@IsOptional()
	@IsUUID()
	salesRepId?: string;

	@ApiPropertyOptional()
	@IsOptional()
	@IsString()
	notes?: string;
}

export class UpdateCustomerDto extends PartialType(CreateCustomerDto) {}
