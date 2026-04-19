import { PartialType } from "@nestjs/swagger";
import { CreateVehicleDto } from "src/vehicles/dto/create-vehicle.dto";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsOptional } from "class-validator";

export class UpdateVehicleDto extends PartialType(CreateVehicleDto) {
	@ApiPropertyOptional()
	@IsOptional()
	@IsBoolean()
	active?: boolean;
}
