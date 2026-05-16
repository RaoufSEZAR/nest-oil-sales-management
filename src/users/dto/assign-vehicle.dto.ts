import { ApiProperty } from "@nestjs/swagger";
import { IsInt, Min } from "class-validator";

export class AssignVehicleDto {
	@ApiProperty({ description: "Vehicle id to assign", example: 1 })
	@IsInt()
	@Min(1)
	vehicle_id: number;
}
