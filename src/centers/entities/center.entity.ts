import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	ManyToOne,
	OneToMany,
	JoinColumn,
} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { User } from "src/users/entities/user.entity";
import { Vehicle } from "src/vehicles/entities/vehicle.entity";
import { CenterType } from "src/centers/enums/center-type.enum";

@Entity("centers")
export class Center {
	@ApiProperty()
	@PrimaryGeneratedColumn()
	id: number;

	@ApiProperty({ description: "Center display name" })
	@Column({ type: "varchar", length: 100 })
	name: string;

	@ApiProperty({ description: "Unique center code" })
	@Column({ type: "varchar", length: 20, unique: true })
	code: string;

	@ApiProperty({ enum: CenterType })
	@Column({
		name: "center_type",
		type: "enum",
		enum: CenterType,
		default: CenterType.BRANCH,
	})
	centerType: CenterType;

	@ApiProperty({
		description:
			"Independent agent vs company-owned (legacy is_independent)",
	})
	@Column({ name: "is_independent", default: false })
	isIndependent: boolean;

	@ApiProperty({ required: false })
	@Column({ type: "text", nullable: true })
	address?: string | null;

	@ApiProperty({ required: false, description: "Manager user UUID" })
	@Column({ name: "manager_id", type: "uuid", nullable: true })
	managerId?: string | null;

	@ManyToOne(() => User, { nullable: true, eager: false })
	@JoinColumn({ name: "manager_id" })
	manager?: User | null;

	@ApiProperty({ required: false })
	@Column({ name: "parent_center_id", type: "int", nullable: true })
	parentCenterId?: number | null;

	@ManyToOne(() => Center, (c) => c.branches, { nullable: true })
	@JoinColumn({ name: "parent_center_id" })
	parentCenter?: Center | null;

	@OneToMany(() => Center, (c) => c.parentCenter)
	branches: Center[];

	@OneToMany(() => Vehicle, (v) => v.center)
	vehicles: Vehicle[];

	@OneToMany(() => User, (u) => u.center)
	users: User[];

	@ApiProperty()
	@Column({ default: true })
	active: boolean;

	@CreateDateColumn({ name: "created_at" })
	createdAt: Date;

	@UpdateDateColumn({ name: "updated_at" })
	updatedAt: Date;
}
