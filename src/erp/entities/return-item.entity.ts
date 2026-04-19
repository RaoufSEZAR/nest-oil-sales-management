import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { SalesReturn } from "src/erp/entities/sales-return.entity";
import { Product } from "src/products/entities/product.entity";
import { ReturnItemCondition } from "src/erp/enums/return-item-condition.enum";

@Entity("return_items")
export class ReturnItem {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => SalesReturn, (r) => r.items, { onDelete: "CASCADE" })
	@JoinColumn({ name: "return_id" })
	salesReturn: SalesReturn;

	@ManyToOne(() => Product)
	@JoinColumn({ name: "product_id" })
	product: Product;

	@Column({ type: "decimal", precision: 10, scale: 2 })
	quantity: string;

	@Column({ name: "unit_price", type: "decimal", precision: 10, scale: 2 })
	unitPrice: string;

	@Column({ type: "decimal", precision: 10, scale: 2 })
	total: string;

	@Column({
		type: "enum",
		enum: ReturnItemCondition,
		default: ReturnItemCondition.GOOD,
	})
	condition: ReturnItemCondition;

	@Column({ name: "reason_detail", type: "text", nullable: true })
	reasonDetail?: string | null;
}
