import {
	Body,
	Controller,
	Delete,
	Get,
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
import { ErpExpensesService } from "src/erp/expenses.service";
import { CreateExpenseDto } from "src/erp/dto/documents.dto";
import { SwaggerTags } from "src/swagger/api-tags";

@ApiTags(SwaggerTags.ErpExpenses)
@Controller("expenses")
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ErpExpensesController {
	constructor(private readonly expenses: ErpExpensesService) {}

	@Get("categories")
	@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.MANAGER)
	@ApiOperation({ summary: "Expense categories (legacy GET /expenses/categories)" })
	getCategories() {
		return this.expenses.getCategories();
	}

	@Get()
	@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.MANAGER)
	@ApiOperation({ summary: "List expenses" })
	@ApiQuery({ name: "category", required: false })
	@ApiQuery({ name: "center_id", required: false })
	@ApiQuery({ name: "from_date", required: false })
	@ApiQuery({ name: "to_date", required: false })
	findAll(
		@Query("category") category?: string,
		@Query("center_id") center_id?: string,
		@Query("from_date") from_date?: string,
		@Query("to_date") to_date?: string,
	) {
		return this.expenses.findAll({
			category,
			center_id: center_id ? parseInt(center_id, 10) : undefined,
			from_date,
			to_date,
		});
	}

	@Get(":id")
	@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.MANAGER)
	@ApiOperation({ summary: "Get expense by id" })
	findOne(@Param("id", ParseIntPipe) id: number) {
		return this.expenses.findOne(id);
	}

	@Post()
	@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.MANAGER)
	@ApiOperation({ summary: "Create expense" })
	create(@Body() dto: CreateExpenseDto) {
		return this.expenses.create(dto);
	}

	@Delete(":id")
	@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
	@ApiOperation({ summary: "Delete expense" })
	remove(@Param("id", ParseIntPipe) id: number) {
		return this.expenses.remove(id);
	}
}
