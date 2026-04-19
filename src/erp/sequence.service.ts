import { BadRequestException, Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";

const SEED_MAP: Record<string, { prefix: string; pad: number }> = {
	INV: { prefix: "INV", pad: 6 },
	PAY: { prefix: "PAY", pad: 6 },
	CH: { prefix: "CH", pad: 6 },
	RET: { prefix: "RET", pad: 6 },
	EXP: { prefix: "EXP", pad: 6 },
	TRIP: { prefix: "TRIP", pad: 6 },
	PO: { prefix: "PO", pad: 6 },
	EXG: { prefix: "EXG", pad: 6 },
	TRF: { prefix: "TRF", pad: 6 },
};

@Injectable()
export class SequenceService {
	constructor(private readonly dataSource: DataSource) {}

	async next(seqType: string): Promise<string> {
		const key = seqType.toUpperCase();
		const seed = SEED_MAP[key];
		if (!seed) {
			throw new BadRequestException(`Unknown sequence type: ${seqType}`);
		}
		const rows = await this.dataSource.query(
			`INSERT INTO sequences (seq_type, prefix, pad_length, current_value, created_at, updated_at)
       VALUES ($1, $2, $3, 1, NOW(), NOW())
       ON CONFLICT (seq_type) DO UPDATE SET
         current_value = sequences.current_value + 1,
         updated_at = NOW()
       RETURNING current_value, prefix, pad_length`,
			[key, seed.prefix, seed.pad],
		);
		const row = rows[0];
		const n = Number(row.current_value);
		return `${row.prefix}-${String(n).padStart(Number(row.pad_length), "0")}`;
	}
}
