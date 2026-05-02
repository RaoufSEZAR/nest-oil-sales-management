import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	ManyToOne,
	JoinColumn,
} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { User } from "src/users/entities/user.entity";
import { Center } from "src/centers/entities/center.entity";
import { SubCenterRequestStatus } from "src/centers/enums/sub-center-request-status.enum";

@Entity("sub_center_requests")
export class SubCenterRequest {
	@ApiProperty()
	@PrimaryGeneratedColumn()
	id: number;

	@ApiProperty({ description: "Requested display name for the new branch" })
	@Column({ name: "requested_name", type: "varchar", length: 200 })
	requestedName: string;

	@ApiProperty({ required: false })
	@Column({ type: "varchar", length: 500, nullable: true })
	location?: string | null;

	@ApiProperty({ required: false })
	@Column({ type: "text", nullable: true })
	notes?: string | null;

	@ApiProperty({ description: "User who submitted the request" })
	@Column({ name: "requested_by_user_id", type: "uuid" })
	requestedByUserId: string;

	@ManyToOne(() => User, { nullable: false })
	@JoinColumn({ name: "requested_by_user_id" })
	requestedByUser?: User;

	@ApiProperty({
		required: false,
		description: "Submitting user's center at time of request",
	})
	@Column({ name: "requested_from_center_id", type: "int", nullable: true })
	requestedFromCenterId?: number | null;

	@ManyToOne(() => Center, { nullable: true })
	@JoinColumn({ name: "requested_from_center_id" })
	requestedFromCenter?: Center | null;

	@ApiProperty({ enum: SubCenterRequestStatus })
	@Column({
		type: "enum",
		enum: SubCenterRequestStatus,
		default: SubCenterRequestStatus.PENDING,
	})
	status: SubCenterRequestStatus;

	@ApiProperty()
	@CreateDateColumn({ name: "created_at" })
	createdAt: Date;
}
