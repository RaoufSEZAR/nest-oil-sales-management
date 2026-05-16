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
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { TripStatus } from "src/erp/enums/trip-status.enum";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { Roles } from "src/auth/decorators/roles.decorator";
import { UserRole } from "src/users/enums/user-role.enum";
import { ErpVehicleTripsService } from "src/erp/vehicle-trips.service";
import {
	CreateVehicleTripDto,
	UpdateVehicleTripDto,
} from "src/erp/dto/documents.dto";
import { SwaggerTags } from "src/swagger/api-tags";

@ApiTags(SwaggerTags.ErpVehicleTrips)
@Controller("vehicle-trips")
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ErpVehicleTripsController {
	constructor(private readonly trips: ErpVehicleTripsService) {}

	@Get("active")
	@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.MANAGER, UserRole.USER)
	@ApiOperation({ summary: "Active trip for vehicle (legacy GET /trips/active)" })
	@ApiQuery({ name: "vehicle_id", required: true, type: Number })
	findActive(@Query("vehicle_id") vehicleIdRaw: string) {
		const vehicleId = parseInt(vehicleIdRaw, 10);
		return this.trips.findActiveByVehicle(vehicleId);
	}

	@Get()
	@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.MANAGER)
	@ApiOperation({ summary: "List vehicle trips" })
	@ApiQuery({ name: "vehicle_id", required: false })
	@ApiQuery({ name: "status", required: false, enum: TripStatus })
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
	@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.MANAGER)
	@ApiOperation({ summary: "Get trip by id" })
	findOne(@Param("id", ParseIntPipe) id: number) {
		return this.trips.findOne(id);
	}

	@Post()
	@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
	@ApiOperation({ summary: "Start a vehicle trip" })
	create(@Body() dto: CreateVehicleTripDto) {
		return this.trips.create(dto);
	}

	@Patch(":id")
	@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
	@ApiOperation({ summary: "Update trip (odometer end, status, etc.)" })
	update(
		@Param("id", ParseIntPipe) id: number,
		@Body() dto: UpdateVehicleTripDto,
	) {
		return this.trips.update(id, dto);
	}
}
