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
	ApiBody,
	ApiOkResponse,
	ApiBadRequestResponse,
	ApiForbiddenResponse,
	ApiConflictResponse,
} from "@nestjs/swagger";
import { ProductsService } from "src/products/products.service";
import { CreateProductDto } from "src/products/dto/create-product.dto";
import { UpdateProductDto } from "src/products/dto/update-product.dto";
import { BulkUpsertProductsDto } from "src/products/dto/bulk-upsert-products.dto";
import { BulkUpsertProductsResultDto } from "src/products/dto/bulk-upsert-result.dto";
import { OIL_CATALOG_PRODUCTS } from "src/products/data/oil-catalog.seed";
import { Product } from "src/products/entities/product.entity";
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

	@Post("bulk")
	@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
	@ApiOperation({
		summary: "Bulk create or update products by SKU (admin)",
		description:
			"Upserts each item in `products` by unique `sku`. Set `updateExisting` to false to skip existing SKUs instead of updating them.",
	})
	@ApiBody({ type: BulkUpsertProductsDto })
	@ApiOkResponse({
		type: BulkUpsertProductsResultDto,
		description: "Counts of created, updated, skipped rows and per-SKU errors",
	})
	@ApiBadRequestResponse({ description: "Validation error or empty products array" })
	@ApiForbiddenResponse({ description: "Admin role required" })
	bulkUpsert(@Body() dto: BulkUpsertProductsDto): Promise<BulkUpsertProductsResultDto> {
		return this.productsService.bulkUpsert(
			dto.products,
			dto.updateExisting !== false,
		);
	}

	@Post("seed/oil-catalog")
	@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
	@ApiOperation({
		summary: "Import default oil catalog (40 products) in one click",
		description:
			"No request body. Loads the built-in Vollmax / Nytron / other oil SKUs and upserts by SKU. Safe to run multiple times when `updateExisting` is true (default).",
	})
	@ApiQuery({
		name: "updateExisting",
		required: false,
		type: Boolean,
		description: "Update rows when SKU already exists (default true)",
	})
	@ApiOkResponse({
		type: BulkUpsertProductsResultDto,
		description: "Import summary (created / updated / skipped / errors)",
	})
	@ApiForbiddenResponse({ description: "Admin role required" })
	seedOilCatalog(
		@Query("updateExisting") updateExistingRaw?: string,
	): Promise<BulkUpsertProductsResultDto> {
		const updateExisting =
			updateExistingRaw === undefined ||
			updateExistingRaw === "true" ||
			updateExistingRaw === "1";
		return this.productsService.bulkUpsert(
			OIL_CATALOG_PRODUCTS,
			updateExisting,
		);
	}

	@Post()
	@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
	@ApiOperation({ summary: "Create product" })
	@ApiBody({ type: CreateProductDto })
	@ApiOkResponse({ type: Product })
	@ApiConflictResponse({ description: "SKU already exists" })
	@ApiForbiddenResponse({ description: "Admin role required" })
	create(@Body() dto: CreateProductDto) {
		return this.productsService.create(dto);
	}

	@Get(":id")
	@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.MANAGER)
	@ApiOperation({ summary: "Get product by id with inventory rows" })
	@ApiOkResponse({ type: Product })
	findOne(@Param("id", ParseIntPipe) id: number) {
		return this.productsService.findOne(id);
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
