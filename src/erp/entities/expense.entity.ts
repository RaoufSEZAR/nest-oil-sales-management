import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from "typeorm";
import { Center } from "src/centers/entities/center.entity";
import { User } from "src/users/entities/user.entity";
import { TradeCurrency } from "src/erp/enums/trade-currency.enum";

@Entity("expenses")
export class Expense {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ name: "expense_number", type: "varchar", length: 50, unique: true })
	expenseNumber: string;

	@ManyToOne(() => Center, { nullable: true })
	@JoinColumn({ name: "center_id" })
	center?: Center | null;

	@Column({ type: "varchar", length: 50 })
	category: string;

	@Column({ type: "varchar", length: 255, nullable: true })
	description?: string | null;

	@Column({ type: "decimal", precision: 15, scale: 4 })
	amount: string;

	@Column({
		type: "enum",
		enum: TradeCurrency,
		default: TradeCurrency.USD,
	})
	currency: TradeCurrency;

	@Column({ name: "exchange_rate", type: "decimal", precision: 10, scale: 2, default: 1 })
	exchangeRate: string;

	@Column({ name: "amount_usd", type: "decimal", precision: 15, scale: 4 })
	amountUsd: string;

	@Column({ type: "date" })
	date: string;

	@ManyToOne(() => User)
	@JoinColumn({ name: "paid_by" })
	paidBy: User;

	@Column({ type: "text", nullable: true })
	notes?: string | null;

	@CreateDateColumn({ name: "created_at" })
	createdAt: Date;

	@UpdateDateColumn({ name: "updated_at" })
	updatedAt: Date;
}
