import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from "typeorm";
import { Customer } from "src/erp/entities/customer.entity";
import { User } from "src/users/entities/user.entity";
import { TradeCurrency } from "src/erp/enums/trade-currency.enum";

@Entity("payments")
export class Payment {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ name: "payment_number", type: "varchar", length: 50, unique: true })
	paymentNumber: string;

	@ManyToOne(() => Customer)
	@JoinColumn({ name: "customer_id" })
	customer: Customer;

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

	@Column({ name: "amount_usd", type: "decimal", precision: 15, scale: 4, nullable: true })
	amountUsd?: string | null;

	@Column({ name: "payment_method", type: "varchar", length: 20, default: "نقدي" })
	paymentMethod: string;

	@Column({ name: "payment_date", type: "timestamp" })
	paymentDate: Date;

	@ManyToOne(() => User)
	@JoinColumn({ name: "received_by" })
	receivedBy: User;

	@Column({ name: "reference_number", type: "varchar", length: 100, nullable: true })
	referenceNumber?: string | null;

	@Column({ type: "text", nullable: true })
	notes?: string | null;

	@Column({ name: "related_invoices", type: "jsonb", nullable: true })
	relatedInvoices?: Record<string, unknown> | null;

	@Column({ name: "edited_once", default: false })
	editedOnce: boolean;

	@Column({ name: "last_edit_allowed_until", type: "timestamp", nullable: true })
	lastEditAllowedUntil?: Date | null;

	@CreateDateColumn({ name: "created_at" })
	createdAt: Date;

	@UpdateDateColumn({ name: "updated_at" })
	updatedAt: Date;
}
