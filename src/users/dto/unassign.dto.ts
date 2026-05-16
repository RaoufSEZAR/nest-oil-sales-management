import { ApiProperty } from "@nestjs/swagger";
import { IsIn, IsString } from "class-validator";

export class UnassignDto {
	@ApiProperty({
		description: "What to unassign",
		enum: ["vehicle", "center", "all"],
		example: "all",
	})
	@IsString()
	@IsIn(["vehicle", "center", "all"])
	remove: "vehicle" | "center" | "all";
}
