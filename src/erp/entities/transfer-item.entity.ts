import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { InventoryTransfer } from "src/erp/entities/inventory-transfer.entity";
import { Product } from "src/products/entities/product.entity";

@Entity("transfer_items")
export class TransferItem {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => InventoryTransfer, (t) => t.items, {
		onDelete: "CASCADE",
	})
	@JoinColumn({ name: "transfer_id" })
	transfer: InventoryTransfer;

	@ManyToOne(() => Product)
	@JoinColumn({ name: "product_id" })
	product: Product;

	@Column({ type: "decimal", precision: 10, scale: 2 })
	quantity: string;

	@Column({ name: "received_quantity", type: "decimal", precision: 10, scale: 2, nullable: true })
	receivedQuantity?: string | null;

	@Column({ name: "condition_notes", type: "text", nullable: true })
	conditionNotes?: string | null;
}
