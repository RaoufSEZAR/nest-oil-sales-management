import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Purchase } from "src/erp/entities/purchase.entity";
import { Center } from "src/centers/entities/center.entity";
import { Product } from "src/products/entities/product.entity";
import { User } from "src/users/entities/user.entity";

@Entity("purchase_distributions")
export class PurchaseDistribution {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => Purchase, (p) => p.distributions)
	@JoinColumn({ name: "purchase_id" })
	purchase: Purchase;

	@ManyToOne(() => Center)
	@JoinColumn({ name: "center_id" })
	center: Center;

	@ManyToOne(() => Product)
	@JoinColumn({ name: "product_id" })
	product: Product;

	@Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
	quantity: string;

	@ManyToOne(() => User, { nullable: true })
	@JoinColumn({ name: "distributed_by" })
	distributedBy?: User | null;

	@Column({ name: "distributed_at", type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
	distributedAt: Date;

	@Column({ type: "text", nullable: true })
	notes?: string | null;
}
