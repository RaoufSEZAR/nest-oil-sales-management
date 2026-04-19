import { PartialType } from "@nestjs/swagger";
import { CreateCenterDto } from "src/centers/dto/create-center.dto";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsOptional } from "class-validator";

export class UpdateCenterDto extends PartialType(CreateCenterDto) {
	@ApiPropertyOptional()
	@IsOptional()
	@IsBoolean()
	active?: boolean;
}
