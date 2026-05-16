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
import { ApiBearerAuth, ApiQuery, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { Roles } from "src/auth/decorators/roles.decorator";
import { UserRole, ERP_MANAGEMENT_ROLES } from "src/users/enums/user-role.enum";
import { ErpCashHandoversService } from "src/erp/cash-handovers.service";
import {
	CreateCashHandoverDto,
	UpdateCashHandoverDto,
} from "src/erp/dto/documents.dto";
import { CashHandoverStatus } from "src/erp/enums/cash-handover-status.enum";

@ApiTags("Cash (legacy)")
@Controller("cash")
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class CashLegacyController {
	constructor(private readonly handovers: ErpCashHandoversService) {}

	@Get("vehicle/:vehicle_id")
	@Roles(...ERP_MANAGEMENT_ROLES, UserRole.USER)
	@ApiQuery({ name: "status", required: false })
	getVehicleHandovers(
		@Param("vehicle_id", ParseIntPipe) vehicleId: number,
		@Query("status") status?: CashHandoverStatus,
	) {
		return this.handovers.findFiltered({
			from_type: "vehicle",
			from_id: vehicleId,
			status,
		});
	}

	@Get("center/:center_id")
	@Roles(...ERP_MANAGEMENT_ROLES)
	getCenterHandovers(
		@Param("center_id", ParseIntPipe) centerId: number,
		@Query("status") status?: CashHandoverStatus,
	) {
		return this.handovers.findFiltered({
			to_type: "center",
			to_id: centerId,
			status,
		});
	}

	@Get()
	@Roles(...ERP_MANAGEMENT_ROLES)
	findAll(
		@Query("from_type") from_type?: string,
		@Query("from_id") from_id?: string,
		@Query("status") status?: CashHandoverStatus,
	) {
		return this.handovers.findFiltered({
			from_type,
			from_id: from_id ? parseInt(from_id, 10) : undefined,
			status,
		});
	}

	@Get(":id")
	@Roles(...ERP_MANAGEMENT_ROLES)
	findOne(@Param("id", ParseIntPipe) id: number) {
		return this.handovers.findOne(id);
	}

	@Post()
	@Roles(...ERP_MANAGEMENT_ROLES, UserRole.USER)
	create(
		@Request() req: { user: { userId: string } },
		@Body() dto: CreateCashHandoverDto,
	) {
		return this.handovers.create({
			...dto,
			handedById: dto.handedById ?? req.user.userId,
		});
	}

	@Patch(":id/confirm")
	@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.MANAGER)
	confirm(
		@Param("id", ParseIntPipe) id: number,
		@Request() req: { user: { userId: string } },
	) {
		return this.handovers.confirm(id, req.user.userId);
	}

	@Patch(":id/reject")
	@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.MANAGER)
	reject(
		@Param("id", ParseIntPipe) id: number,
		@Body() body: { notes?: string },
	) {
		return this.handovers.reject(id, body.notes);
	}

	@Patch(":id")
	@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
	update(
		@Param("id", ParseIntPipe) id: number,
		@Body() dto: UpdateCashHandoverDto,
	) {
		return this.handovers.update(id, dto);
	}
}
