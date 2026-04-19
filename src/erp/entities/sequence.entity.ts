import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from "typeorm";

@Entity("sequences")
export class Sequence {
	@PrimaryColumn({ name: "seq_type", type: "varchar", length: 20 })
	seqType: string;

	@Column({ type: "varchar", length: 20 })
	prefix: string;

	@Column({ name: "pad_length", type: "int" })
	padLength: number;

	@Column({ name: "current_value", type: "int", default: 0 })
	currentValue: number;

	@CreateDateColumn({ name: "created_at" })
	createdAt: Date;

	@UpdateDateColumn({ name: "updated_at" })
	updatedAt: Date;
}
