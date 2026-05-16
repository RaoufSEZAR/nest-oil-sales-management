import {
	Body,
	Controller,
	Delete,
	Get,
	Patch,
	Put,
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
import { ErpCustomersService } from "src/erp/customers.service";
import { CreateCustomerDto, UpdateCustomerDto } from "src/erp/dto/customer.dto";
import { SwaggerTags } from "src/swagger/api-tags";

@ApiTags(SwaggerTags.ErpCustomers)
@Controller("customers")
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ErpCustomersController {
	constructor(private readonly customers: ErpCustomersService) {}

	@Get()
	@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.MANAGER)
	@ApiOperation({ summary: "List customers" })
	@ApiQuery({ name: "search", required: false })
	@ApiQuery({ name: "sales_rep_id", required: false })
	@ApiQuery({ name: "area", required: false })
	findAll(
		@Query("search") search?: string,
		@Query("sales_rep_id") sales_rep_id?: string,
		@Query("area") area?: string,
	) {
		return this.customers.findAll({ search, sales_rep_id, area });
	}

	@Get(":id/balance")
	@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.MANAGER)
	@ApiOperation({ summary: "Customer balance (legacy GET /customers/:id/balance)" })
	getBalance(@Param("id", ParseIntPipe) id: number) {
		return this.customers.getBalance(id);
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

	@Put(":id")
	@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
	@ApiOperation({ summary: "Update customer (legacy PUT)" })
	updatePut(
		@Param("id", ParseIntPipe) id: number,
		@Body() dto: UpdateCustomerDto,
	) {
		return this.customers.update(id, dto);
	}

	@Delete(":id")
	@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
	@ApiOperation({ summary: "Delete customer" })
	remove(@Param("id", ParseIntPipe) id: number) {
		return this.customers.remove(id);
	}
}
