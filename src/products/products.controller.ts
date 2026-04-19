import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Delete,
	Param,
	ParseIntPipe,
	Query,
	UseGuards,
} from "@nestjs/common";
import {
	ApiTags,
	ApiOperation,
	ApiBearerAuth,
	ApiQuery,
} from "@nestjs/swagger";
import { ProductsService } from "src/products/products.service";
import { CreateProductDto } from "src/products/dto/create-product.dto";
import { UpdateProductDto } from "src/products/dto/update-product.dto";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { Roles } from "src/auth/decorators/roles.decorator";
import { UserRole } from "src/users/enums/user-role.enum";

@ApiTags("Products")
@Controller("products")
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ProductsController {
	constructor(private readonly productsService: ProductsService) {}

	@Get("categories")
	@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.MANAGER)
	@ApiOperation({ summary: "Distinct product categories" })
	getCategories() {
		return this.productsService.distinctCategories();
	}

	@Get()
	@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.MANAGER)
	@ApiOperation({ summary: "List products with pagination" })
	@ApiQuery({ name: "search", required: false })
	@ApiQuery({ name: "category", required: false })
	@ApiQuery({ name: "active", required: false, type: Boolean })
	@ApiQuery({ name: "page", required: false, type: Number })
	@ApiQuery({ name: "limit", required: false, type: Number })
	findAll(
		@Query("search") search?: string,
		@Query("category") category?: string,
		@Query("active") activeRaw?: string,
		@Query("page") pageRaw?: string,
		@Query("limit") limitRaw?: string,
	) {
		let active: boolean | undefined;
		if (activeRaw === "true") active = true;
		else if (activeRaw === "false") active = false;
		const page = pageRaw ? parseInt(pageRaw, 10) : undefined;
		const limit = limitRaw ? parseInt(limitRaw, 10) : undefined;
		return this.productsService.findAll({
			search,
			category,
			active,
			page: Number.isFinite(page) ? page : undefined,
			limit: Number.isFinite(limit) ? limit : undefined,
		});
	}

	@Get(":id")
	@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.MANAGER)
	@ApiOperation({ summary: "Get product by id with inventory rows" })
	findOne(@Param("id", ParseIntPipe) id: number) {
		return this.productsService.findOne(id);
	}

	@Post()
	@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
	@ApiOperation({ summary: "Create product" })
	create(@Body() dto: CreateProductDto) {
		return this.productsService.create(dto);
	}

	@Patch(":id")
	@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
	@ApiOperation({ summary: "Update product" })
	update(
		@Param("id", ParseIntPipe) id: number,
		@Body() dto: UpdateProductDto,
	) {
		return this.productsService.update(id, dto);
	}

	@Delete(":id")
	@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
	@ApiOperation({
		summary: "Deactivate product (legacy delete = soft delete)",
	})
	remove(@Param("id", ParseIntPipe) id: number) {
		return this.productsService.softDelete(id);
	}
}
