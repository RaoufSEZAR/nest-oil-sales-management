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
import { SalesReturnStatus } from "src/erp/enums/sales-return-status.enum";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { Roles } from "src/auth/decorators/roles.decorator";
import { UserRole } from "src/users/enums/user-role.enum";
import { ErpReturnsService } from "src/erp/returns.service";
import { CreateSalesReturnDto } from "src/erp/dto/documents.dto";
import { SwaggerTags } from "src/swagger/api-tags";

@ApiTags(SwaggerTags.ErpSalesReturns)
@Controller("returns")
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ErpReturnsController {
	constructor(private readonly returns: ErpReturnsService) {}

	@Get("report")
	@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.MANAGER)
	@ApiOperation({ summary: "Returns report by product (legacy)" })
	getReport(
		@Query("from_date") from_date?: string,
		@Query("to_date") to_date?: string,
		@Query("status") status?: SalesReturnStatus,
	) {
		return this.returns.getReport({ from_date, to_date, status });
	}

	@Get()
	@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.MANAGER)
	@ApiOperation({ summary: "List sales returns" })
	@ApiQuery({ name: "customer_id", required: false })
	@ApiQuery({ name: "sales_rep_id", required: false })
	@ApiQuery({ name: "status", required: false, enum: SalesReturnStatus })
	@ApiQuery({ name: "from_date", required: false })
	@ApiQuery({ name: "to_date", required: false })
	findAll(
		@Query("customer_id") customer_id?: string,
		@Query("sales_rep_id") sales_rep_id?: string,
		@Query("status") status?: SalesReturnStatus,
		@Query("from_date") from_date?: string,
		@Query("to_date") to_date?: string,
	) {
		return this.returns.findAll({
			customer_id: customer_id ? parseInt(customer_id, 10) : undefined,
			sales_rep_id,
			status,
			from_date,
			to_date,
		});
	}

	@Get(":id")
	@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.MANAGER)
	@ApiOperation({ summary: "Get return by id" })
	findOne(@Param("id", ParseIntPipe) id: number) {
		return this.returns.findOne(id);
	}

	@Post()
	@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
	@ApiOperation({
		summary: "Create sales return (pending until approved)",
	})
	create(@Body() dto: CreateSalesReturnDto) {
		return this.returns.create(dto);
	}

	@Patch(":id/status")
	@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
	@ApiOperation({ summary: "Approve or reject return (legacy)" })
	updateStatus(
		@Param("id", ParseIntPipe) id: number,
		@Body() body: { status: SalesReturnStatus; manager_notes?: string },
	) {
		return this.returns.updateStatus(id, body.status, body.manager_notes);
	}
}
