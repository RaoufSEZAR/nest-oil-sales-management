import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsIn, IsNumber, IsOptional, Min } from "class-validator";

export class UpdateHrSettingsDto {
	@ApiPropertyOptional()
	@IsOptional()
	@IsNumber()
	@Min(0)
	base_salary?: number;

	@ApiPropertyOptional()
	@IsOptional()
	@IsNumber()
	@Min(0)
	commission_rate?: number;

	@ApiPropertyOptional({ enum: ["sales", "cash"] })
	@IsOptional()
	@IsIn(["sales", "cash"])
	commission_basis?: "sales" | "cash";
}
