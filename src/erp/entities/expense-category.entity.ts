import {
	Column,
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from "typeorm";

@Entity("expense_categories")
export class ExpenseCategory {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: "varchar", length: 50, unique: true })
	name: string;

	@Column({ type: "varchar", length: 255, nullable: true })
	description?: string | null;

	@Column({ name: "sort_order", type: "int", default: 0 })
	sortOrder: number;

	@Column({ type: "boolean", default: true })
	active: boolean;

	@CreateDateColumn({ name: "created_at" })
	createdAt: Date;

	@UpdateDateColumn({ name: "updated_at" })
	updatedAt: Date;
}
