import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Put,
	Param,
	ParseIntPipe,
	Query,
	UseGuards,
} from "@nestjs/common";
import {
	ApiTags,
	ApiOperation,
	ApiBearerAuth,
	ApiQuery,
	ApiResponse,
} from "@nestjs/swagger";
import { VehiclesService } from "src/vehicles/vehicles.service";
import { CreateVehicleDto } from "src/vehicles/dto/create-vehicle.dto";
import { UpdateVehicleDto } from "src/vehicles/dto/update-vehicle.dto";
import { Vehicle } from "src/vehicles/entities/vehicle.entity";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { Roles } from "src/auth/decorators/roles.decorator";
import { UserRole } from "src/users/enums/user-role.enum";

const VEHICLE_READ_ROLES = [
	UserRole.ADMIN,
	UserRole.SUPER_ADMIN,
	UserRole.MANAGER,
] as const;

const VEHICLE_WRITE_ROLES = [
	UserRole.ADMIN,
	UserRole.SUPER_ADMIN,
	UserRole.MANAGER,
] as const;

@ApiTags("Vehicles")
@Controller("vehicles")
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class VehiclesController {
	constructor(private readonly vehiclesService: VehiclesService) {}

	@Get()
	@Roles(...VEHICLE_READ_ROLES)
	@ApiOperation({
		summary: "List vehicles (legacy GET /vehicles with center_id, active filters)",
	})
	@ApiQuery({ name: "center_id", type: Number, required: false })
	@ApiQuery({ name: "active", type: Boolean, required: false })
	@ApiResponse({ status: 200, description: "Vehicles list", type: [Vehicle] })
	findAll(
		@Query("center_id") centerIdRaw?: string,
		@Query("active") activeRaw?: string,
	) {
		const centerId =
			centerIdRaw !== undefined && centerIdRaw !== ""
				? parseInt(centerIdRaw, 10)
				: undefined;
		let active: boolean | undefined;
		if (activeRaw === "true") active = true;
		else if (activeRaw === "false") active = false;
		return this.vehiclesService.findAll({
			centerId: Number.isFinite(centerId) ? centerId : undefined,
			active,
		});
	}

	@Get(":id")
	@Roles(...VEHICLE_READ_ROLES)
	@ApiOperation({
		summary:
			"Get vehicle by id with center, sales rep, and last 10 trips (legacy GET /vehicles/:id)",
	})
	@ApiResponse({ status: 200, description: "Vehicle found", type: Vehicle })
	@ApiResponse({ status: 404, description: "Vehicle not found" })
	findOne(@Param("id", ParseIntPipe) id: number) {
		return this.vehiclesService.findOne(id);
	}

	@Post()
	@Roles(...VEHICLE_WRITE_ROLES)
	@ApiOperation({ summary: "Create vehicle (legacy POST /vehicles)" })
	@ApiResponse({ status: 201, description: "Vehicle created", type: Vehicle })
	@ApiResponse({ status: 409, description: "Vehicle code already exists" })
	create(@Body() dto: CreateVehicleDto) {
		return this.vehiclesService.create(dto);
	}

	@Put(":id")
	@Roles(...VEHICLE_WRITE_ROLES)
	@ApiOperation({ summary: "Update vehicle (legacy PUT /vehicles/:id)" })
	@ApiResponse({ status: 200, description: "Vehicle updated", type: Vehicle })
	updatePut(
		@Param("id", ParseIntPipe) id: number,
		@Body() dto: UpdateVehicleDto,
	) {
		return this.vehiclesService.update(id, dto);
	}

	@Patch(":id")
	@Roles(...VEHICLE_WRITE_ROLES)
	@ApiOperation({ summary: "Update vehicle (partial)" })
	@ApiResponse({ status: 200, description: "Vehicle updated", type: Vehicle })
	update(
		@Param("id", ParseIntPipe) id: number,
		@Body() dto: UpdateVehicleDto,
	) {
		return this.vehiclesService.update(id, dto);
	}
}
