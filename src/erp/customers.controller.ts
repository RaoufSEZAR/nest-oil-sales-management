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
import { ErpCustomersService } from "src/erp/customers.service";
import { CreateCustomerDto, UpdateCustomerDto } from "src/erp/dto/customer.dto";

@ApiTags("ERP — Customers")
@Controller("customers")
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ErpCustomersController {
	constructor(private readonly customers: ErpCustomersService) {}

	@Get()
	@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.MANAGER)
	@ApiOperation({ summary: "List customers" })
	findAll() {
		return this.customers.findAll();
	}

	@Get(":id")
	@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.MANAGER)
	@ApiOperation({ summary: "Get customer by id" })
	findOne(@Param("id", ParseIntPipe) id: number) {
		return this.customers.findOne(id);
	}

	@Post()
	@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
	@ApiOperation({ summary: "Create customer" })
	create(@Body() dto: CreateCustomerDto) {
		return this.customers.create(dto);
	}

	@Patch(":id")
	@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
	@ApiOperation({ summary: "Update customer" })
	update(
		@Param("id", ParseIntPipe) id: number,
		@Body() dto: UpdateCustomerDto,
	) {
		return this.customers.update(id, dto);
	}
}
