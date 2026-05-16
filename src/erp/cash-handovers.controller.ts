import {
	Body,
	Controller,
	Get,
	Patch,
	Param,
	Post,
	ParseIntPipe,
	Query,
	Request,
	UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { CashHandoverStatus } from "src/erp/enums/cash-handover-status.enum";
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
	@ApiQuery({ name: "from_type", required: false })
	@ApiQuery({ name: "from_id", required: false })
	@ApiQuery({ name: "to_type", required: false })
	@ApiQuery({ name: "to_id", required: false })
	@ApiQuery({ name: "status", required: false, enum: CashHandoverStatus })
	findAll(
		@Query("from_type") from_type?: string,
		@Query("from_id") from_id?: string,
		@Query("to_type") to_type?: string,
		@Query("to_id") to_id?: string,
		@Query("status") status?: CashHandoverStatus,
	) {
		return this.handovers.findFiltered({
			from_type,
			from_id: from_id ? parseInt(from_id, 10) : undefined,
			to_type,
			to_id: to_id ? parseInt(to_id, 10) : undefined,
			status,
		});
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

	@Patch(":id/confirm")
	@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
	@ApiOperation({ summary: "Confirm cash handover (legacy)" })
	confirm(
		@Param("id", ParseIntPipe) id: number,
		@Request() req: { user: { userId: string } },
	) {
		return this.handovers.confirm(id, req.user.userId);
	}

	@Patch(":id/reject")
	@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
	@ApiOperation({ summary: "Reject cash handover (legacy)" })
	reject(
		@Param("id", ParseIntPipe) id: number,
		@Body() body: { notes?: string },
	) {
		return this.handovers.reject(id, body.notes);
	}
}
