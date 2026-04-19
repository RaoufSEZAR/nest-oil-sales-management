import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
	IsBoolean,
	IsEnum,
	IsInt,
	IsOptional,
	IsString,
	IsUUID,
	MaxLength,
	MinLength,
} from "class-validator";
import { CenterType } from "src/centers/enums/center-type.enum";

export class CreateCenterDto {
	@ApiProperty({ example: "Main depot" })
	@IsString()
	@MinLength(1)
	@MaxLength(100)
	name: string;

	@ApiProperty({ example: "CENTER-001" })
	@IsString()
	@MinLength(1)
	@MaxLength(20)
	code: string;

	@ApiPropertyOptional({ enum: CenterType, default: CenterType.BRANCH })
	@IsOptional()
	@IsEnum(CenterType)
	centerType?: CenterType;

	@ApiPropertyOptional({ default: false })
	@IsOptional()
	@IsBoolean()
	isIndependent?: boolean;

	@ApiPropertyOptional()
	@IsOptional()
	@IsString()
	address?: string;

	@ApiPropertyOptional()
	@IsOptional()
	@IsUUID()
	managerId?: string;

	@ApiPropertyOptional()
	@IsOptional()
	@IsInt()
	parentCenterId?: number;
}
