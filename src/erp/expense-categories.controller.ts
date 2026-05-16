import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	ParseIntPipe,
	Patch,
	Post,
	Query,
	UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { Roles } from "src/auth/decorators/roles.decorator";
import { UserRole } from "src/users/enums/user-role.enum";
import { ErpExpenseCategoriesService } from "src/erp/expense-categories.service";
import {
	CreateExpenseCategoryDto,
	UpdateExpenseCategoryDto,
} from "src/erp/dto/expense-category.dto";
import { SwaggerTags } from "src/swagger/api-tags";

@ApiTags(SwaggerTags.ErpExpenses)
@Controller("expense-categories")
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ErpExpenseCategoriesController {
	constructor(private readonly categories: ErpExpenseCategoriesService) {}

	@Get()
	@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.MANAGER)
	@ApiOperation({ summary: "List expense categories" })
	@ApiQuery({ name: "all", required: false, description: "Include inactive" })
	findAll(@Query("all") all?: string) {
		if (all === "1" || all === "true") {
			return this.categories.findAllForAdmin();
		}
		return this.categories.findAll(false);
	}

	@Get(":id")
	@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.MANAGER)
	@ApiOperation({ summary: "Get expense category by id" })
	findOne(@Param("id", ParseIntPipe) id: number) {
		return this.categories.findOne(id);
	}

	@Post()
	@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.MANAGER)
	@ApiOperation({ summary: "Create expense category" })
	create(@Body() dto: CreateExpenseCategoryDto) {
		return this.categories.create(dto);
	}

	@Patch(":id")
	@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.MANAGER)
	@ApiOperation({ summary: "Update expense category" })
	update(
		@Param("id", ParseIntPipe) id: number,
		@Body() dto: UpdateExpenseCategoryDto,
	) {
		return this.categories.update(id, dto);
	}

	@Delete(":id")
	@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.MANAGER)
	@ApiOperation({ summary: "Delete expense category" })
	remove(@Param("id", ParseIntPipe) id: number) {
		return this.categories.remove(id);
	}
}
