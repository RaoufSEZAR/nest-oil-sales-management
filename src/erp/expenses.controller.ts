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
import { ErpExpensesService } from "src/erp/expenses.service";
import { CreateExpenseDto } from "src/erp/dto/documents.dto";

@ApiTags("ERP — Expenses")
@Controller("expenses")
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ErpExpensesController {
	constructor(private readonly expenses: ErpExpensesService) {}

	@Get()
	@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.MANAGER)
	@ApiOperation({ summary: "List expenses" })
	findAll() {
		return this.expenses.findAll();
	}

	@Get(":id")
	@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.MANAGER)
	@ApiOperation({ summary: "Get expense by id" })
	findOne(@Param("id", ParseIntPipe) id: number) {
		return this.expenses.findOne(id);
	}

	@Post()
	@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
	@ApiOperation({ summary: "Create expense" })
	create(@Body() dto: CreateExpenseDto) {
		return this.expenses.create(dto);
	}
}
