import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
	IsInt,
	IsOptional,
	IsString,
	IsUUID,
	MaxLength,
	MinLength,
} from "class-validator";

export class CreateVehicleDto {
	@ApiProperty()
	@IsString()
	@MinLength(1)
	@MaxLength(100)
	name: string;

	@ApiProperty({ example: "VEH-001" })
	@IsString()
	@MinLength(1)
	@MaxLength(20)
	code: string;

	@ApiPropertyOptional()
	@IsOptional()
	@IsString()
	@MaxLength(20)
	licensePlate?: string;

	@ApiProperty({ description: "Center id (integer FK)" })
	@IsInt()
	centerId: number;

	@ApiPropertyOptional()
	@IsOptional()
	@IsUUID()
	currentSalesRepId?: string;

	@ApiPropertyOptional()
	@IsOptional()
	@IsString()
	@MaxLength(50)
	vehicleType?: string;
}
