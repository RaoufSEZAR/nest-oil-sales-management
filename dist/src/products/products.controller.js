"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const products_service_1 = require("./products.service");
const create_product_dto_1 = require("./dto/create-product.dto");
const update_product_dto_1 = require("./dto/update-product.dto");
const bulk_upsert_products_dto_1 = require("./dto/bulk-upsert-products.dto");
const bulk_upsert_result_dto_1 = require("./dto/bulk-upsert-result.dto");
const adjust_product_stock_dto_1 = require("./dto/adjust-product-stock.dto");
const oil_catalog_seed_1 = require("./data/oil-catalog.seed");
const product_entity_1 = require("./entities/product.entity");
const api_tags_1 = require("../swagger/api-tags");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const user_role_enum_1 = require("../users/enums/user-role.enum");
let ProductsController = class ProductsController {
    constructor(productsService) {
        this.productsService = productsService;
    }
    getCategories() {
        return this.productsService.distinctCategories();
    }
    findAll(search, category, activeRaw, pageRaw, limitRaw) {
        let active;
        if (activeRaw === "true")
            active = true;
        else if (activeRaw === "false")
            active = false;
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
    bulkUpsert(dto) {
        return this.productsService.bulkUpsert(dto.products, dto.updateExisting !== false);
    }
    seedOilCatalog(updateExistingRaw) {
        const updateExisting = updateExistingRaw === undefined ||
            updateExistingRaw === "true" ||
            updateExistingRaw === "1";
        return this.productsService.bulkUpsert(oil_catalog_seed_1.OIL_CATALOG_PRODUCTS, updateExisting);
    }
    create(dto) {
        return this.productsService.create(dto);
    }
    findOne(id) {
        return this.productsService.findOne(id);
    }
    increaseStock(id, dto) {
        return this.productsService.increaseStock(id, dto.quantity);
    }
    decreaseStock(id, dto) {
        return this.productsService.decreaseStock(id, dto.quantity);
    }
    update(id, dto) {
        return this.productsService.update(id, dto);
    }
    remove(id) {
        return this.productsService.softDelete(id);
    }
};
exports.ProductsController = ProductsController;
__decorate([
    (0, common_1.Get)("categories"),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.SUPER_ADMIN, user_role_enum_1.UserRole.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: "Distinct product categories" }),
    openapi.ApiResponse({ status: 200, type: [String] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "getCategories", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.SUPER_ADMIN, user_role_enum_1.UserRole.MANAGER),
    (0, swagger_1.ApiOperation)({
        summary: "List products with pagination",
        description: "Each product includes **`stock`** (warehouse/catalog quantity).",
    }),
    (0, swagger_1.ApiQuery)({ name: "search", required: false }),
    (0, swagger_1.ApiQuery)({ name: "category", required: false }),
    (0, swagger_1.ApiQuery)({ name: "active", required: false, type: Boolean }),
    (0, swagger_1.ApiQuery)({ name: "page", required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: "limit", required: false, type: Number }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Query)("search")),
    __param(1, (0, common_1.Query)("category")),
    __param(2, (0, common_1.Query)("active")),
    __param(3, (0, common_1.Query)("page")),
    __param(4, (0, common_1.Query)("limit")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)("bulk"),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({
        summary: "Bulk create or update products by SKU (admin)",
        description: "Upserts each item in `products` by unique `sku`. Every item must include required **`stock`** (≥ 0). Set `updateExisting` to false to skip existing SKUs instead of updating them.",
    }),
    (0, swagger_1.ApiBody)({ type: bulk_upsert_products_dto_1.BulkUpsertProductsDto }),
    (0, swagger_1.ApiOkResponse)({
        type: bulk_upsert_result_dto_1.BulkUpsertProductsResultDto,
        description: "Counts of created, updated, skipped rows and per-SKU errors",
    }),
    (0, swagger_1.ApiBadRequestResponse)({ description: "Validation error or empty products array" }),
    (0, swagger_1.ApiForbiddenResponse)({ description: "Admin role required" }),
    openapi.ApiResponse({ status: 201, type: require("./dto/bulk-upsert-result.dto").BulkUpsertProductsResultDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [bulk_upsert_products_dto_1.BulkUpsertProductsDto]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "bulkUpsert", null);
__decorate([
    (0, common_1.Post)("seed/oil-catalog"),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({
        summary: "Import default oil catalog (40 products) in one click",
        description: `No request body. Loads the built-in Vollmax / Nytron / other oil SKUs and upserts by SKU with **stock = ${oil_catalog_seed_1.OIL_CATALOG_DEFAULT_STOCK}** each. Safe to run multiple times when \`updateExisting\` is true (default).`,
    }),
    (0, swagger_1.ApiQuery)({
        name: "updateExisting",
        required: false,
        type: Boolean,
        description: "Update rows when SKU already exists (default true)",
    }),
    (0, swagger_1.ApiOkResponse)({
        type: bulk_upsert_result_dto_1.BulkUpsertProductsResultDto,
        description: "Import summary (created / updated / skipped / errors)",
    }),
    (0, swagger_1.ApiForbiddenResponse)({ description: "Admin role required" }),
    openapi.ApiResponse({ status: 201, type: require("./dto/bulk-upsert-result.dto").BulkUpsertProductsResultDto }),
    __param(0, (0, common_1.Query)("updateExisting")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "seedOilCatalog", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({
        summary: "Create product",
        description: "Requires **`stock`** alongside name, sku, and price.",
    }),
    (0, swagger_1.ApiBody)({ type: create_product_dto_1.CreateProductDto }),
    (0, swagger_1.ApiOkResponse)({ type: product_entity_1.Product }),
    (0, swagger_1.ApiConflictResponse)({ description: "SKU already exists" }),
    (0, swagger_1.ApiForbiddenResponse)({ description: "Admin role required" }),
    openapi.ApiResponse({ status: 201, type: require("./entities/product.entity").Product }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_product_dto_1.CreateProductDto]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(":id"),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.SUPER_ADMIN, user_role_enum_1.UserRole.MANAGER),
    (0, swagger_1.ApiOperation)({
        summary: "Get product by id with inventory rows",
        description: "Returns product **`stock`** plus optional per-location `inventory` rows.",
    }),
    (0, swagger_1.ApiOkResponse)({ type: product_entity_1.Product }),
    openapi.ApiResponse({ status: 200, type: require("./entities/product.entity").Product }),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(":id/stock/increase"),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({
        summary: "Increase product stock",
        description: "Adds `quantity` to the product's **`stock`** field.",
    }),
    (0, swagger_1.ApiBody)({ type: adjust_product_stock_dto_1.AdjustProductStockDto }),
    (0, swagger_1.ApiOkResponse)({ type: product_entity_1.Product }),
    (0, swagger_1.ApiNotFoundResponse)({ description: "Product not found" }),
    (0, swagger_1.ApiBadRequestResponse)({ description: "Invalid quantity" }),
    openapi.ApiResponse({ status: 200, type: require("./entities/product.entity").Product }),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, adjust_product_stock_dto_1.AdjustProductStockDto]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "increaseStock", null);
__decorate([
    (0, common_1.Patch)(":id/stock/decrease"),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({
        summary: "Decrease product stock",
        description: "Subtracts `quantity` from **`stock`**. Returns **400** if stock would go negative.",
    }),
    (0, swagger_1.ApiBody)({ type: adjust_product_stock_dto_1.AdjustProductStockDto }),
    (0, swagger_1.ApiOkResponse)({ type: product_entity_1.Product }),
    (0, swagger_1.ApiNotFoundResponse)({ description: "Product not found" }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: "Insufficient stock or invalid quantity",
    }),
    openapi.ApiResponse({ status: 200, type: require("./entities/product.entity").Product }),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, adjust_product_stock_dto_1.AdjustProductStockDto]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "decreaseStock", null);
__decorate([
    (0, common_1.Patch)(":id"),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({
        summary: "Update product",
        description: "Partial update; include **`stock`** to set absolute quantity (not a delta).",
    }),
    openapi.ApiResponse({ status: 200, type: require("./entities/product.entity").Product }),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_product_dto_1.UpdateProductDto]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":id"),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({
        summary: "Deactivate product (legacy delete = soft delete)",
    }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "remove", null);
exports.ProductsController = ProductsController = __decorate([
    (0, swagger_1.ApiTags)(api_tags_1.SwaggerTags.Products),
    (0, common_1.Controller)("products"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [products_service_1.ProductsService])
], ProductsController);
//# sourceMappingURL=products.controller.js.map