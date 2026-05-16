import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	ManyToOne,
	JoinColumn,
} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { UserRole, DEFAULT_USER_ROLE } from "src/users/enums/user-role.enum";
import { Center } from "src/centers/entities/center.entity";
import { Vehicle } from "src/vehicles/entities/vehicle.entity";

@Entity("users")
export class User {
	@ApiProperty({ description: "User ID (UUID)" })
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@ApiProperty({ description: "User email address" })
	@Column({ unique: true })
	email: string;

	@ApiProperty({ description: "User password (hashed)" })
	@Column()
	password: string;

	@ApiProperty({ description: "User first name" })
	@Column()
	firstName: string;

	@ApiProperty({ description: "User last name" })
	@Column()
	lastName: string;

	@ApiProperty({
		description: "User phone number",
		example: "+1234567890",
		required: false,
	})
	@Column({ nullable: true })
	phoneNumber?: string;

	@ApiProperty({
		description: "User address",
		example: "123 Main St, City, Country",
		required: false,
	})
	@Column({ nullable: true })
	address?: string;

	@ApiProperty({
		description: "Preferred language",
		example: "en",
		required: false,
	})
	@Column({ nullable: true })
	preferredLang?: string;

	@ApiProperty({ description: "User region", example: "US", required: false })
	@Column({ nullable: true })
	region?: string;

	@ApiProperty({
		description: "User role",
		enum: UserRole,
		example: UserRole.USER,
		default: DEFAULT_USER_ROLE,
	})
	@Column({
		type: "enum",
		enum: UserRole,
		default: DEFAULT_USER_ROLE,
	})
	role: UserRole;

	@ApiProperty({ description: "User active status" })
	@Column({ default: true })
	isActive: boolean;

	@ApiProperty({ description: "Monthly base salary (HR)", required: false })
	@Column({
		name: "base_salary",
		type: "decimal",
		precision: 10,
		scale: 2,
		nullable: true,
		default: 0,
	})
	baseSalary?: string | null;

	@ApiProperty({ description: "Commission rate percent (HR)", required: false })
	@Column({
		name: "commission_rate",
		type: "decimal",
		precision: 5,
		scale: 2,
		nullable: true,
		default: 0,
	})
	commissionRate?: string | null;

	@ApiProperty({
		description: "Commission basis: sales or cash",
		required: false,
	})
	@Column({
		name: "commission_basis",
		type: "varchar",
		length: 10,
		nullable: true,
		default: "sales",
	})
	commissionBasis?: string | null;

	@ApiProperty({
		description: "Legacy ERP center assignment (integer FK to centers.id)",
		required: false,
	})
	@Column({ name: "center_id", type: "int", nullable: true })
	centerId?: number | null;

	@ManyToOne(() => Center, (c) => c.users, { nullable: true })
	@JoinColumn({ name: "center_id" })
	center?: Center | null;

	@ApiProperty({
		description: "Legacy ERP vehicle assignment (integer FK to vehicles.id)",
		required: false,
	})
	@Column({ name: "vehicle_id", type: "int", nullable: true })
	vehicleId?: number | null;

	@ManyToOne(() => Vehicle, { nullable: true })
	@JoinColumn({ name: "vehicle_id" })
	vehicle?: Vehicle | null;

	@ApiProperty({ description: "Account creation date" })
	@CreateDateColumn()
	createdAt: Date;

	@ApiProperty({ description: "Last update date" })
	@UpdateDateColumn()
	updatedAt: Date;
}
