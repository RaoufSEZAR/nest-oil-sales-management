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
import { Center } from "src/centers/entities/center.entity";
import { User } from "src/users/entities/user.entity";
import { PurchaseItem } from "src/erp/entities/purchase-item.entity";
import { PurchaseDistribution } from "src/erp/entities/purchase-distribution.entity";
import { TradeCurrency } from "src/erp/enums/trade-currency.enum";
import { PurchasePaymentStatus } from "src/erp/enums/purchase-payment-status.enum";
import { PurchaseReceiptStatus } from "src/erp/enums/purchase-receipt-status.enum";

@Entity("purchases")
export class Purchase {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ name: "purchase_number", type: "varchar", length: 50, unique: true })
	purchaseNumber: string;

	@ManyToOne(() => Center, { nullable: true })
	@JoinColumn({ name: "center_id" })
	center?: Center | null;

	@Column({ name: "supplier_name", type: "varchar", length: 150 })
	supplierName: string;

	@Column({ name: "supplier_phone", type: "varchar", length: 30, nullable: true })
	supplierPhone?: string | null;

	@Column({ type: "date" })
	date: string;

	@Column({ name: "total_amount", type: "decimal", precision: 15, scale: 4 })
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

	@Column({ name: "amount_usd", type: "decimal", precision: 15, scale: 4, default: 0 })
	amountUsd: string;

	@Column({
		name: "payment_status",
		type: "enum",
		enum: PurchasePaymentStatus,
		default: PurchasePaymentStatus.UNPAID,
	})
	paymentStatus: PurchasePaymentStatus;

	@Column({
		name: "receipt_status",
		type: "enum",
		enum: PurchaseReceiptStatus,
		default: PurchaseReceiptStatus.PENDING,
	})
	receiptStatus: PurchaseReceiptStatus;

	@ManyToOne(() => User, { nullable: true })
	@JoinColumn({ name: "confirmed_by" })
	confirmedBy?: User | null;

	@Column({ name: "confirmed_at", type: "timestamp", nullable: true })
	confirmedAt?: Date | null;

	@ManyToOne(() => User)
	@JoinColumn({ name: "created_by" })
	createdBy: User;

	@Column({ name: "purchase_type", type: "varchar", length: 20, default: "center" })
	purchaseType: string;

	@Column({ name: "customs_cost", type: "decimal", precision: 15, scale: 4, default: 0 })
	customsCost: string;

	@Column({ name: "shipping_cost", type: "decimal", precision: 15, scale: 4, default: 0 })
	shippingCost: string;

	@Column({ name: "distribution_status", type: "varchar", length: 20, nullable: true })
	distributionStatus?: string | null;

	@Column({ type: "text", nullable: true })
	notes?: string | null;

	@OneToMany(() => PurchaseItem, (line) => line.purchase)
	items: PurchaseItem[];

	@OneToMany(() => PurchaseDistribution, (line) => line.purchase)
	distributions: PurchaseDistribution[];

	@CreateDateColumn({ name: "created_at" })
	createdAt: Date;

	@UpdateDateColumn({ name: "updated_at" })
	updatedAt: Date;
}
