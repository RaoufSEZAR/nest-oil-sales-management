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
import { ErpCashHandoversService } from "src/erp/cash-handovers.service";
import {
	CreateCashHandoverDto,
	UpdateCashHandoverDto,
} from "src/erp/dto/documents.dto";
import { SwaggerTags } from "src/swagger/api-tags";

@ApiTags(SwaggerTags.ErpCashHandovers)
@Controller("cash-handovers")
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ErpCashHandoversController {
	constructor(private readonly handovers: ErpCashHandoversService) {}

	@Get()
	@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.MANAGER)
	@ApiOperation({ summary: "List cash handovers" })
	findAll() {
		return this.handovers.findAll();
	}

	@Get(":id")
	@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.MANAGER)
	@ApiOperation({ summary: "Get handover by id" })
	findOne(@Param("id", ParseIntPipe) id: number) {
		return this.handovers.findOne(id);
	}

	@Post()
	@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
	@ApiOperation({ summary: "Create cash handover" })
	create(@Body() dto: CreateCashHandoverDto) {
		return this.handovers.create(dto);
	}

	@Patch(":id")
	@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
	@ApiOperation({ summary: "Update handover (confirm / reject)" })
	update(
		@Param("id", ParseIntPipe) id: number,
		@Body() dto: UpdateCashHandoverDto,
	) {
		return this.handovers.update(id, dto);
	}
}
