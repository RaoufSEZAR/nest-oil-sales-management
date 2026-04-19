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
import { CentersService } from "src/centers/centers.service";
import { CreateCenterDto } from "src/centers/dto/create-center.dto";
import { UpdateCenterDto } from "src/centers/dto/update-center.dto";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { Roles } from "src/auth/decorators/roles.decorator";
import { UserRole } from "src/users/enums/user-role.enum";
import { CenterType } from "src/centers/enums/center-type.enum";

@ApiTags("Centers")
@Controller("centers")
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class CentersController {
	constructor(private readonly centersService: CentersService) {}

	@Get()
	@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.MANAGER)
	@ApiOperation({ summary: "List centers (legacy centersController.getCenters)" })
	@ApiQuery({ name: "center_type", enum: CenterType, required: false })
	@ApiQuery({ name: "active", type: Boolean, required: false })
	findAll(
		@Query("center_type") centerType?: CenterType,
		@Query("active") activeRaw?: string,
	) {
		let active: boolean | undefined;
		if (activeRaw === "true") active = true;
		else if (activeRaw === "false") active = false;
		return this.centersService.findAll({ centerType, active });
	}

	@Get(":id")
	@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.MANAGER)
	@ApiOperation({ summary: "Get center by id" })
	findOne(@Param("id", ParseIntPipe) id: number) {
		return this.centersService.findOne(id);
	}

	@Post()
	@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
	@ApiOperation({ summary: "Create center" })
	create(@Body() dto: CreateCenterDto) {
		return this.centersService.create(dto);
	}

	@Patch(":id")
	@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
	@ApiOperation({ summary: "Update center" })
	update(
		@Param("id", ParseIntPipe) id: number,
		@Body() dto: UpdateCenterDto,
	) {
		return this.centersService.update(id, dto);
	}
}
