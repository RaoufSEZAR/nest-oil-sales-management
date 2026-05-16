import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, Min } from "class-validator";

export class AdjustProductStockDto {
	@ApiProperty({
		description: "Units to add (increase) or remove (decrease); must be > 0",
		minimum: 0,
		example: 10,
	})
	@Type(() => Number)
	@IsNumber()
	@Min(0)
	quantity: number;
}
