import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from "typeorm";
import { Vehicle } from "src/vehicles/entities/vehicle.entity";
import { User } from "src/users/entities/user.entity";
import { TripStatus } from "src/erp/enums/trip-status.enum";

@Entity("vehicle_trips")
export class VehicleTrip {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ name: "trip_number", type: "varchar", length: 50, unique: true })
	tripNumber: string;

	@ManyToOne(() => Vehicle, { onDelete: "CASCADE" })
	@JoinColumn({ name: "vehicle_id" })
	vehicle: Vehicle;

	@ManyToOne(() => User)
	@JoinColumn({ name: "sales_rep_id" })
	salesRep: User;

	@Column({ name: "trip_date", type: "date" })
	tripDate: string;

	@Column({ name: "odometer_start", type: "int" })
	odometerStart: number;

	@Column({ name: "odometer_start_photo", type: "text", nullable: true })
	odometerStartPhoto?: string | null;

	@Column({ name: "odometer_end", type: "int", nullable: true })
	odometerEnd?: number | null;

	@Column({ name: "odometer_end_photo", type: "text", nullable: true })
	odometerEndPhoto?: string | null;

	@Column({ name: "distance_km", type: "int", nullable: true })
	distanceKm?: number | null;

	@Column({ name: "fuel_compensation", type: "decimal", precision: 10, scale: 2, nullable: true })
	fuelCompensation?: string | null;

	@Column({ type: "text", nullable: true })
	notes?: string | null;

	@Column({
		type: "enum",
		enum: TripStatus,
		default: TripStatus.ACTIVE,
	})
	status: TripStatus;

	@Column({ name: "started_at", type: "timestamp" })
	startedAt: Date;

	@Column({ name: "ended_at", type: "timestamp", nullable: true })
	endedAt?: Date | null;

	@CreateDateColumn({ name: "created_at" })
	createdAt: Date;

	@UpdateDateColumn({ name: "updated_at" })
	updatedAt: Date;
}
