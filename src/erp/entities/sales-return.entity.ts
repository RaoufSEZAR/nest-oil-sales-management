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
import { Invoice } from "src/erp/entities/invoice.entity";
import { ReturnItem } from "src/erp/entities/return-item.entity";
import { SalesReturnType } from "src/erp/enums/sales-return-type.enum";
import { SalesReturnStatus } from "src/erp/enums/sales-return-status.enum";

@Entity("returns")
export class SalesReturn {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ name: "return_number", type: "varchar", length: 50, unique: true })
	returnNumber: string;

	@Column({
		name: "return_type",
		type: "enum",
		enum: SalesReturnType,
	})
	returnType: SalesReturnType;

	@ManyToOne(() => Invoice, { nullable: true })
	@JoinColumn({ name: "original_invoice_id" })
	originalInvoice?: Invoice | null;

	@ManyToOne(() => Customer)
	@JoinColumn({ name: "customer_id" })
	customer: Customer;

	@ManyToOne(() => User)
	@JoinColumn({ name: "sales_rep_id" })
	salesRep: User;

	@Column({ type: "date" })
	date: string;

	@Column({ name: "total_amount", type: "decimal", precision: 10, scale: 2 })
	totalAmount: string;

	@Column({ type: "varchar", length: 255, nullable: true })
	reason?: string | null;

	@Column({
		type: "enum",
		enum: SalesReturnStatus,
		default: SalesReturnStatus.APPROVED,
	})
	status: SalesReturnStatus;

	@Column({ type: "text", nullable: true })
	notes?: string | null;

	@Column({ default: false })
	synced: boolean;

	@OneToMany(() => ReturnItem, (line) => line.salesReturn)
	items: ReturnItem[];

	@CreateDateColumn({ name: "created_at" })
	createdAt: Date;

	@UpdateDateColumn({ name: "updated_at" })
	updatedAt: Date;
}
