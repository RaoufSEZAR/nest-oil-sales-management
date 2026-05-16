import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, Min } from "class-validator";

export class AdjustProductStockDto {
	@ApiProperty({ description: "Quantity to add or remove", minimum: 0 })
	@Type(() => Number)
	@IsNumber()
	@Min(0)
	quantity: number;
}
