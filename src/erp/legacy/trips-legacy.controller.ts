import {
	Body,
	Controller,
	Get,
	Patch,
	Param,
	Post,
	ParseIntPipe,
	Query,
	UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { Roles } from "src/auth/decorators/roles.decorator";
import { UserRole, ERP_MANAGEMENT_ROLES } from "src/users/enums/user-role.enum";
import { ErpVehicleTripsService } from "src/erp/vehicle-trips.service";
import {
	CreateVehicleTripDto,
	UpdateVehicleTripDto,
} from "src/erp/dto/documents.dto";
import { TripStatus } from "src/erp/enums/trip-status.enum";

/** Legacy path alias: `/trips` → same as `/vehicle-trips`. */
@ApiTags("Trips (legacy)")
@Controller("trips")
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class TripsLegacyController {
	constructor(private readonly trips: ErpVehicleTripsService) {}

	@Get("active")
	@Roles(...ERP_MANAGEMENT_ROLES, UserRole.USER)
	@ApiOperation({ summary: "Active trip for vehicle" })
	findActive(@Query("vehicle_id") vehicleIdRaw: string) {
		return this.trips.findActiveByVehicle(parseInt(vehicleIdRaw, 10));
	}

	@Get()
	@Roles(...ERP_MANAGEMENT_ROLES)
	findAll(
		@Query("vehicle_id") vehicle_id?: string,
		@Query("status") status?: TripStatus,
	) {
		return this.trips.findAll({
			vehicle_id: vehicle_id ? parseInt(vehicle_id, 10) : undefined,
			status,
		});
	}

	@Get(":id")
	@Roles(...ERP_MANAGEMENT_ROLES)
	findOne(@Param("id", ParseIntPipe) id: number) {
		return this.trips.findOne(id);
	}

	@Post()
	@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
	create(@Body() dto: CreateVehicleTripDto) {
		return this.trips.create(dto);
	}

	@Patch(":id")
	@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.USER)
	update(
		@Param("id", ParseIntPipe) id: number,
		@Body() dto: UpdateVehicleTripDto,
	) {
		return this.trips.update(id, dto);
	}
}
