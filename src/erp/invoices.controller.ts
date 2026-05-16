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
import { InvoicePaymentStatus } from "src/erp/enums/invoice-payment-status.enum";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { Roles } from "src/auth/decorators/roles.decorator";
import { UserRole } from "src/users/enums/user-role.enum";
import { ErpInvoicesService } from "src/erp/invoices.service";
import { CreateInvoiceDto } from "src/erp/dto/documents.dto";
import { SwaggerTags } from "src/swagger/api-tags";

@ApiTags(SwaggerTags.ErpInvoices)
@Controller("invoices")
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ErpInvoicesController {
	constructor(private readonly invoices: ErpInvoicesService) {}

	@Get()
	@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.MANAGER)
	@ApiOperation({ summary: "List invoices with line items" })
	@ApiQuery({ name: "customer_id", required: false })
	@ApiQuery({ name: "sales_rep_id", required: false })
	@ApiQuery({ name: "from_date", required: false })
	@ApiQuery({ name: "to_date", required: false })
	@ApiQuery({ name: "payment_status", required: false, enum: InvoicePaymentStatus })
	findAll(
		@Query("customer_id") customer_id?: string,
		@Query("sales_rep_id") sales_rep_id?: string,
		@Query("from_date") from_date?: string,
		@Query("to_date") to_date?: string,
		@Query("payment_status") payment_status?: InvoicePaymentStatus,
	) {
		return this.invoices.findAll({
			customer_id: customer_id ? parseInt(customer_id, 10) : undefined,
			sales_rep_id,
			from_date,
			to_date,
			payment_status,
		});
	}

	@Get(":id")
	@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.MANAGER)
	@ApiOperation({ summary: "Get invoice by id" })
	findOne(@Param("id", ParseIntPipe) id: number) {
		return this.invoices.findOne(id);
	}

	@Post()
	@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
	@ApiOperation({
		summary: "Create invoice (numbered via sequences)",
		description:
			"Decreases **product stock** by each line item quantity. Fails with **400** if stock is insufficient.",
	})
	create(@Body() dto: CreateInvoiceDto) {
		return this.invoices.create(dto);
	}

	@Patch(":id")
	@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
	@ApiOperation({ summary: "Update invoice header / payment fields" })
	update(
		@Param("id", ParseIntPipe) id: number,
		@Body()
		body: {
			paidAmount?: number;
			paymentStatus?: InvoicePaymentStatus;
			notes?: string;
		},
	) {
		return this.invoices.update(id, body);
	}

	@Delete(":id")
	@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
	@ApiOperation({ summary: "Delete invoice" })
	remove(@Param("id", ParseIntPipe) id: number) {
		return this.invoices.remove(id);
	}
}
