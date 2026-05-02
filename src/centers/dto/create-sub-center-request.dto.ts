import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class CreateSubCenterRequestDto {
	@ApiProperty({ example: "مركز حلب الغربي" })
	@IsString()
	@MinLength(1)
	@MaxLength(200)
	centerName: string;

	@ApiPropertyOptional()
	@IsOptional()
	@IsString()
	@MaxLength(500)
	location?: string;

	@ApiPropertyOptional()
	@IsOptional()
	@IsString()
	@MaxLength(4000)
	notes?: string;
}
