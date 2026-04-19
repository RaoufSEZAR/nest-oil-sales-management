import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from "typeorm";
import { User } from "src/users/entities/user.entity";

@Entity("customers")
export class Customer {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: "varchar", length: 100 })
	name: string;

	@Column({ type: "varchar", length: 20 })
	phone: string;

	@Column({ type: "text", nullable: true })
	address?: string | null;

	@Column({ type: "varchar", length: 100, nullable: true })
	area?: string | null;

	@Column({ type: "decimal", precision: 15, scale: 4, default: 0 })
	balance: string;

	@Column({ name: "deferred_payment", type: "decimal", precision: 15, scale: 4, default: 0 })
	deferredPayment: string;

	@ManyToOne(() => User, { nullable: true })
	@JoinColumn({ name: "sales_rep_id" })
	salesRep?: User | null;

	@Column({ type: "text", nullable: true })
	notes?: string | null;

	@Column({ name: "edit_count", type: "int", default: 0 })
	editCount: number;

	@Column({ name: "last_edited_at", type: "timestamp", nullable: true })
	lastEditedAt?: Date | null;

	@CreateDateColumn({ name: "created_at" })
	createdAt: Date;

	@UpdateDateColumn({ name: "updated_at" })
	updatedAt: Date;
}
