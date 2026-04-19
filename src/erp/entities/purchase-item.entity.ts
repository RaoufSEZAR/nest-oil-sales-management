import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Purchase } from "src/erp/entities/purchase.entity";
import { Product } from "src/products/entities/product.entity";

@Entity("purchase_items")
export class PurchaseItem {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => Purchase, (p) => p.items, { onDelete: "CASCADE" })
	@JoinColumn({ name: "purchase_id" })
	purchase: Purchase;

	@ManyToOne(() => Product, { nullable: true })
	@JoinColumn({ name: "product_id" })
	product?: Product | null;

	@Column({ type: "varchar", length: 255, nullable: true })
	description?: string | null;

	@Column({ type: "decimal", precision: 10, scale: 2 })
	quantity: string;

	@Column({ name: "unit_price_usd", type: "decimal", precision: 15, scale: 4 })
	unitPriceUsd: string;

	@Column({ name: "total_usd", type: "decimal", precision: 15, scale: 4 })
	totalUsd: string;

	@Column({ name: "distributed_qty", type: "decimal", precision: 10, scale: 2, default: 0 })
	distributedQty: string;
}
