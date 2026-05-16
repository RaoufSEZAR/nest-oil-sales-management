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
import { Center } from "src/centers/entities/center.entity";
import { User } from "src/users/entities/user.entity";
import { VehicleTrip } from "src/erp/entities/vehicle-trip.entity";

@Entity("vehicles")
export class Vehicle {
	@ApiProperty()
	@PrimaryGeneratedColumn()
	id: number;

	@ApiProperty()
	@Column({ type: "varchar", length: 100 })
	name: string;

	@ApiProperty()
	@Column({ type: "varchar", length: 20, unique: true })
	code: string;

	@ApiProperty({ required: false })
	@Column({ name: "license_plate", type: "varchar", length: 20, nullable: true })
	licensePlate?: string | null;

	@ApiProperty()
	@Column({ name: "center_id", type: "int" })
	centerId: number;

	@ManyToOne(() => Center, (c) => c.vehicles, { onDelete: "CASCADE" })
	@JoinColumn({ name: "center_id" })
	center: Center;

	@ApiProperty({ required: false })
	@Column({ name: "current_sales_rep_id", type: "uuid", nullable: true })
	currentSalesRepId?: string | null;

	@ManyToOne(() => User, { nullable: true })
	@JoinColumn({ name: "current_sales_rep_id" })
	currentSalesRep?: User | null;

	@OneToMany(() => VehicleTrip, (trip) => trip.vehicle)
	trips?: VehicleTrip[];

	@ApiProperty({ required: false })
	@Column({ name: "vehicle_type", type: "varchar", length: 50, nullable: true })
	vehicleType?: string | null;

	@ApiProperty()
	@Column({ default: true })
	active: boolean;

	@CreateDateColumn({ name: "created_at" })
	createdAt: Date;

	@UpdateDateColumn({ name: "updated_at" })
	updatedAt: Date;
}
