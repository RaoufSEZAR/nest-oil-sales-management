import {
	Body,
	Controller,
	Delete,
	Get,
	Patch,
	Param,
	Post,
	ParseIntPipe,
	Query,
	UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { Roles } from "src/auth/decorators/roles.decorator";
import { UserRole } from "src/users/enums/user-role.enum";
import { ErpPaymentsService } from "src/erp/payments.service";
import { CreatePaymentDto } from "src/erp/dto/documents.dto";
import { SwaggerTags } from "src/swagger/api-tags";

@ApiTags(SwaggerTags.ErpPayments)
@Controller("payments")
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ErpPaymentsController {
	constructor(private readonly payments: ErpPaymentsService) {}

	@Get("customer/:customer_id")
	@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.MANAGER)
	@ApiOperation({ summary: "Payments for a customer (legacy)" })
	findByCustomer(@Param("customer_id", ParseIntPipe) customerId: number) {
		return this.payments.findByCustomer(customerId);
	}

	@Get()
	@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.MANAGER)
	@ApiOperation({ summary: "List payments" })
	@ApiQuery({ name: "customer_id", required: false })
	@ApiQuery({ name: "received_by", required: false })
	@ApiQuery({ name: "from_date", required: false })
	@ApiQuery({ name: "to_date", required: false })
	findAll(
		@Query("customer_id") customer_id?: string,
		@Query("received_by") received_by?: string,
		@Query("from_date") from_date?: string,
		@Query("to_date") to_date?: string,
	) {
		return this.payments.findAll({
			customer_id: customer_id ? parseInt(customer_id, 10) : undefined,
			received_by,
			from_date,
			to_date,
		});
	}

	@Get(":id")
	@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.MANAGER)
	@ApiOperation({ summary: "Get payment by id" })
	findOne(@Param("id", ParseIntPipe) id: number) {
		return this.payments.findOne(id);
	}

	@Post()
	@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
	@ApiOperation({ summary: "Create payment" })
	create(@Body() dto: CreatePaymentDto) {
		return this.payments.create(dto);
	}

	@Patch(":id")
	@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
	@ApiOperation({ summary: "Update payment" })
	update(
		@Param("id", ParseIntPipe) id: number,
		@Body() dto: CreatePaymentDto,
	) {
		return this.payments.update(id, dto);
	}

	@Delete(":id")
	@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
	@ApiOperation({ summary: "Delete payment" })
	remove(@Param("id", ParseIntPipe) id: number) {
		return this.payments.remove(id);
	}
}
