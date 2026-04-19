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
import { User } from "src/users/entities/user.entity";
import { TransferItem } from "src/erp/entities/transfer-item.entity";
import { TransferLocationType } from "src/erp/enums/transfer-location-type.enum";
import { TransferStatus } from "src/erp/enums/transfer-status.enum";

@Entity("inventory_transfers")
export class InventoryTransfer {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ name: "transfer_number", type: "varchar", length: 50, unique: true })
	transferNumber: string;

	@Column({ name: "from_location_type", type: "enum", enum: TransferLocationType })
	fromLocationType: TransferLocationType;

	@Column({ name: "from_location_id", type: "int" })
	fromLocationId: number;

	@Column({ name: "to_location_type", type: "enum", enum: TransferLocationType })
	toLocationType: TransferLocationType;

	@Column({ name: "to_location_id", type: "int" })
	toLocationId: number;

	@Column({ type: "date" })
	date: string;

	@ManyToOne(() => User, { nullable: true })
	@JoinColumn({ name: "transferred_by" })
	transferredBy?: User | null;

	@ManyToOne(() => User, { nullable: true })
	@JoinColumn({ name: "received_by" })
	receivedBy?: User | null;

	@Column({
		type: "enum",
		enum: TransferStatus,
		default: TransferStatus.PENDING,
	})
	status: TransferStatus;

	@Column({ type: "text", nullable: true })
	notes?: string | null;

	@Column({ name: "completed_at", type: "timestamp", nullable: true })
	completedAt?: Date | null;

	@OneToMany(() => TransferItem, (line) => line.transfer, { cascade: true })
	items: TransferItem[];

	@CreateDateColumn({ name: "created_at" })
	createdAt: Date;

	@UpdateDateColumn({ name: "updated_at" })
	updatedAt: Date;
}
