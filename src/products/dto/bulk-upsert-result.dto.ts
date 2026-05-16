import { ApiProperty } from "@nestjs/swagger";

export class BulkUpsertProductErrorDto {
	@ApiProperty()
	sku: string;

	@ApiProperty()
	message: string;
}

export class BulkUpsertProductsResultDto {
	@ApiProperty()
	created: number;

	@ApiProperty()
	updated: number;

	@ApiProperty()
	skipped: number;

	@ApiProperty()
	total: number;

	@ApiProperty({ type: [BulkUpsertProductErrorDto] })
	errors: BulkUpsertProductErrorDto[];
}
