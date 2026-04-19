import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Invoice } from "src/erp/entities/invoice.entity";
import { Product } from "src/products/entities/product.entity";

@Entity("invoice_items")
export class InvoiceItem {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => Invoice, (inv) => inv.items, { onDelete: "CASCADE" })
	@JoinColumn({ name: "invoice_id" })
	invoice: Invoice;

	@ManyToOne(() => Product, { onDelete: "RESTRICT" })
	@JoinColumn({ name: "product_id" })
	product: Product;

	@Column({ type: "decimal", precision: 10, scale: 2 })
	quantity: string;

	@Column({ name: "unit_price", type: "decimal", precision: 10, scale: 2 })
	unitPrice: string;

	@Column({ type: "decimal", precision: 10, scale: 2 })
	total: string;
}
