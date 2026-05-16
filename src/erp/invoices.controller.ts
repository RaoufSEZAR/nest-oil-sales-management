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
	findAll() {
		return this.invoices.findAll();
	}

	@Get(":id")
	@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.MANAGER)
	@ApiOperation({ summary: "Get invoice by id" })
	findOne(@Param("id", ParseIntPipe) id: number) {
		return this.invoices.findOne(id);
	}

	@Post()
	@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
	@ApiOperation({ summary: "Create invoice (numbered via sequences)" })
	create(@Body() dto: CreateInvoiceDto) {
		return this.invoices.create(dto);
	}
}
