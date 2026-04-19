import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
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
} from "@nestjs/swagger";
import { VehiclesService } from "src/vehicles/vehicles.service";
import { CreateVehicleDto } from "src/vehicles/dto/create-vehicle.dto";
import { UpdateVehicleDto } from "src/vehicles/dto/update-vehicle.dto";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { Roles } from "src/auth/decorators/roles.decorator";
import { UserRole } from "src/users/enums/user-role.enum";

@ApiTags("Vehicles")
@Controller("vehicles")
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class VehiclesController {
	constructor(private readonly vehiclesService: VehiclesService) {}

	@Get()
	@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.MANAGER)
	@ApiOperation({ summary: "List vehicles" })
	@ApiQuery({ name: "center_id", type: Number, required: false })
	@ApiQuery({ name: "active", type: Boolean, required: false })
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
	@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.MANAGER)
	@ApiOperation({ summary: "Get vehicle by id" })
	findOne(@Param("id", ParseIntPipe) id: number) {
		return this.vehiclesService.findOne(id);
	}

	@Post()
	@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
	@ApiOperation({ summary: "Create vehicle" })
	create(@Body() dto: CreateVehicleDto) {
		return this.vehiclesService.create(dto);
	}

	@Patch(":id")
	@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
	@ApiOperation({ summary: "Update vehicle" })
	update(
		@Param("id", ParseIntPipe) id: number,
		@Body() dto: UpdateVehicleDto,
	) {
		return this.vehiclesService.update(id, dto);
	}
}
