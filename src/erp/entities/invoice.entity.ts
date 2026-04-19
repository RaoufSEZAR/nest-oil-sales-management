import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from "typeorm";
import { Customer } from "src/erp/entities/customer.entity";
import { User } from "src/users/entities/user.entity";
import { VehicleTrip } from "src/erp/entities/vehicle-trip.entity";
import { InvoiceItem } from "src/erp/entities/invoice-item.entity";
import { TradeCurrency } from "src/erp/enums/trade-currency.enum";
import { InvoicePaymentStatus } from "src/erp/enums/invoice-payment-status.enum";

@Entity("invoices")
export class Invoice {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ name: "invoice_number", type: "varchar", length: 50, unique: true })
	invoiceNumber: string;

	@ManyToOne(() => Customer, { onDelete: "RESTRICT" })
	@JoinColumn({ name: "customer_id" })
	customer: Customer;

	@ManyToOne(() => User)
	@JoinColumn({ name: "sales_rep_id" })
	salesRep: User;

	@Column({ type: "timestamp" })
	date: Date;

	@Column({ type: "decimal", precision: 10, scale: 2 })
	subtotal: string;

	@Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
	discount: string;

	@Column({ name: "tax_rate", type: "decimal", precision: 5, scale: 2, default: 0 })
	taxRate: string;

	@Column({ name: "tax_amount", type: "decimal", precision: 10, scale: 2, default: 0 })
	taxAmount: string;

	@Column({ name: "total_amount", type: "decimal", precision: 10, scale: 2 })
	totalAmount: string;

	@Column({ name: "paid_amount", type: "decimal", precision: 15, scale: 4, default: 0 })
	paidAmount: string;

	@Column({
		type: "enum",
		enum: TradeCurrency,
		default: TradeCurrency.USD,
	})
	currency: TradeCurrency;

	@Column({ name: "exchange_rate", type: "decimal", precision: 10, scale: 2, default: 1 })
	exchangeRate: string;

	@Column({
		name: "payment_status",
		type: "enum",
		enum: InvoicePaymentStatus,
		default: InvoicePaymentStatus.PENDING,
	})
	paymentStatus: InvoicePaymentStatus;

	@Column({ type: "text", nullable: true })
	notes?: string | null;

	@ManyToOne(() => VehicleTrip, { nullable: true })
	@JoinColumn({ name: "trip_id" })
	trip?: VehicleTrip | null;

	@Column({ name: "edited_once", default: false })
	editedOnce: boolean;

	@Column({ name: "last_edit_allowed_until", type: "timestamp", nullable: true })
	lastEditAllowedUntil?: Date | null;

	@Column({ default: false })
	synced: boolean;

	@OneToMany(() => InvoiceItem, (line) => line.invoice)
	items: InvoiceItem[];

	@CreateDateColumn({ name: "created_at" })
	createdAt: Date;

	@UpdateDateColumn({ name: "updated_at" })
	updatedAt: Date;
}
