import { ApiProperty } from "@nestjs/swagger";
import { IsInt, Min } from "class-validator";

export class AssignCenterDto {
	@ApiProperty({ description: "Center id to assign", example: 1 })
	@IsInt()
	@Min(1)
	center_id: number;
}
