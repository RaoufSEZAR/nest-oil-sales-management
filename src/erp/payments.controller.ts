import {
	Body,
	Controller,
	Get,
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
import { ErpPaymentsService } from "src/erp/payments.service";
import { CreatePaymentDto } from "src/erp/dto/documents.dto";

@ApiTags("ERP — Payments")
@Controller("payments")
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ErpPaymentsController {
	constructor(private readonly payments: ErpPaymentsService) {}

	@Get()
	@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.MANAGER)
	@ApiOperation({ summary: "List payments" })
	findAll() {
		return this.payments.findAll();
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
}
