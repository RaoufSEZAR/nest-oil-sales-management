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
import { CashHandoverStatus } from "src/erp/enums/cash-handover-status.enum";

@Entity("cash_handovers")
export class CashHandover {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ name: "handover_number", type: "varchar", length: 50, unique: true })
	handoverNumber: string;

	@Column({ name: "from_type", type: "varchar", length: 20 })
	fromType: string;

	@Column({ name: "from_id", type: "int" })
	fromId: number;

	@Column({ name: "to_type", type: "varchar", length: 20 })
	toType: string;

	@Column({ name: "to_id", type: "int" })
	toId: number;

	@Column({ type: "decimal", precision: 15, scale: 4 })
	amount: string;

	@Column({ name: "original_currency", type: "varchar", length: 10, default: "USD" })
	originalCurrency: string;

	@Column({ name: "original_amount", type: "decimal", precision: 15, scale: 4, nullable: true })
	originalAmount?: string | null;

	@Column({ name: "handover_date", type: "timestamp" })
	handoverDate: Date;

	@ManyToOne(() => User)
	@JoinColumn({ name: "handed_by" })
	handedBy: User;

	@ManyToOne(() => User, { nullable: true })
	@JoinColumn({ name: "received_by" })
	receivedBy?: User | null;

	@Column({ type: "text", nullable: true })
	notes?: string | null;

	@Column({
		type: "enum",
		enum: CashHandoverStatus,
		default: CashHandoverStatus.PENDING,
	})
	status: CashHandoverStatus;

	@Column({ name: "confirmed_at", type: "timestamp", nullable: true })
	confirmedAt?: Date | null;

	@CreateDateColumn({ name: "created_at" })
	createdAt: Date;

	@UpdateDateColumn({ name: "updated_at" })
	updatedAt: Date;
}
