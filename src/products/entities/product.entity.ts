import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	OneToMany,
	ManyToOne,
	JoinColumn,
} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { InventoryLocationType } from "src/products/enums/inventory-location-type.enum";

@Entity("products")
export class Product {
	@ApiProperty()
	@PrimaryGeneratedColumn()
	id: number;

	@ApiProperty()
	@Column({ type: "varchar", length: 100 })
	name: string;

	@ApiProperty()
	@Column({ type: "varchar", length: 50, unique: true })
	sku: string;

	@ApiProperty({ required: false })
	@Column({ type: "varchar", length: 50, nullable: true })
	category?: string | null;

	@ApiProperty({ required: false, default: "قطعة" })
	@Column({ type: "varchar", length: 20, default: "قطعة" })
	unit: string;

	@ApiProperty()
	@Column({ type: "decimal", precision: 10, scale: 2 })
	price: string;

	@ApiProperty({ required: false })
	@Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
	cost?: string | null;

	@ApiProperty()
	@Column({ default: true })
	active: boolean;

	@OneToMany(() => Inventory, (inv) => inv.product)
	inventory: Inventory[];

	@CreateDateColumn({ name: "created_at" })
	createdAt: Date;

	@UpdateDateColumn({ name: "updated_at" })
	updatedAt: Date;
}

@Entity("inventory")
export class Inventory {
	@ApiProperty()
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ name: "product_id", type: "int" })
	productId: number;

	@ManyToOne(() => Product, (p) => p.inventory, { onDelete: "CASCADE" })
	@JoinColumn({ name: "product_id" })
	product: Product;

	@ApiProperty({ enum: InventoryLocationType })
	@Column({
		name: "location_type",
		type: "enum",
		enum: InventoryLocationType,
	})
	locationType: InventoryLocationType;

	@ApiProperty({
		description: "Center id or vehicle id depending on locationType",
	})
	@Column({ name: "location_id", type: "int" })
	locationId: number;

	@ApiProperty()
	@Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
	quantity: string;

	@UpdateDateColumn({ name: "last_updated" })
	lastUpdated: Date;
}
