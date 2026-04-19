import {
	Body,
	Controller,
	Get,
	Patch,
	Param,
	Post,
	ParseIntPipe,
	UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { Roles } from "src/auth/decorators/roles.decorator";
import { UserRole } from "src/users/enums/user-role.enum";
import { ErpVehicleTripsService } from "src/erp/vehicle-trips.service";
import {
	CreateVehicleTripDto,
	UpdateVehicleTripDto,
} from "src/erp/dto/documents.dto";

@ApiTags("ERP — Vehicle trips")
@Controller("vehicle-trips")
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ErpVehicleTripsController {
	constructor(private readonly trips: ErpVehicleTripsService) {}

	@Get()
	@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.MANAGER)
	@ApiOperation({ summary: "List vehicle trips" })
	findAll() {
		return this.trips.findAll();
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
