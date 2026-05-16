"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildOpenApiDocument = buildOpenApiDocument;
exports.logOpenApiProductPaths = logOpenApiProductPaths;
exports.setupSwagger = setupSwagger;
const swagger_1 = require("@nestjs/swagger");
const create_center_dto_1 = require("../centers/dto/create-center.dto");
const update_center_dto_1 = require("../centers/dto/update-center.dto");
const center_entity_1 = require("../centers/entities/center.entity");
const create_vehicle_dto_1 = require("../vehicles/dto/create-vehicle.dto");
const update_vehicle_dto_1 = require("../vehicles/dto/update-vehicle.dto");
const vehicle_entity_1 = require("../vehicles/entities/vehicle.entity");
const create_product_dto_1 = require("../products/dto/create-product.dto");
const update_product_dto_1 = require("../products/dto/update-product.dto");
const bulk_upsert_products_dto_1 = require("../products/dto/bulk-upsert-products.dto");
const bulk_upsert_result_dto_1 = require("../products/dto/bulk-upsert-result.dto");
const product_entity_1 = require("../products/entities/product.entity");
const adjust_product_stock_dto_1 = require("../products/dto/adjust-product-stock.dto");
const api_tags_1 = require("./api-tags");
const extraModels = [
    center_entity_1.Center,
    create_center_dto_1.CreateCenterDto,
    update_center_dto_1.UpdateCenterDto,
    vehicle_entity_1.Vehicle,
    create_vehicle_dto_1.CreateVehicleDto,
    update_vehicle_dto_1.UpdateVehicleDto,
    product_entity_1.Product,
    product_entity_1.Inventory,
    create_product_dto_1.CreateProductDto,
    update_product_dto_1.UpdateProductDto,
    bulk_upsert_products_dto_1.BulkUpsertProductsDto,
    bulk_upsert_result_dto_1.BulkUpsertProductsResultDto,
    bulk_upsert_result_dto_1.BulkUpsertProductErrorDto,
    adjust_product_stock_dto_1.AdjustProductStockDto,
];
const OPENAPI_BUILD_TIME = new Date().toISOString();
function buildOpenApiDocument(app) {
    const config = new swagger_1.DocumentBuilder()
        .setTitle("Oil Sales API")
        .setDescription([
        "REST API for Oil Sales (NestJS + PostgreSQL + TypeORM).",
        "",
        `**OpenAPI generated at:** \`${OPENAPI_BUILD_TIME}\` (restart API after code changes)`,
        "",
        "**Base path:** `/api/v1`",
        "",
        "| Area | Description |",
        "|------|-------------|",
        "| **Health** | Liveness and basic status |",
        "| **Authentication** | Login, register, refresh, profile |",
        "| **Users** | User CRUD and activation (JWT + roles) |",
        "| **Centers** | Distribution centers (branches, managers, parent/child) |",
        "| **Vehicles** | Fleet vehicles per center |",
        "| **Products** | Catalog with required **`stock`**, bulk/seed import, `PATCH …/stock/increase|decrease`, per-location `inventory` rows |",
        "| **ERP — Customers** | Customer master data |",
        "| **ERP — Invoices** | Sales invoices (line items **decrease** product `stock`) |",
        "| **ERP — Sales returns** | Returns (**increase** product `stock`) |",
        "| **ERP — Payments** | Customer payments |",
        "| **ERP — Vehicle trips** | Trip logs and odometer |",
        "| **ERP — Expenses** | Center expenses |",
        "| **ERP — Purchases** | POs (**increase** stock); distributions (**decrease** stock) |",
        "| **ERP — Currency exchanges** | FX desk operations |",
        "| **ERP — Inventory transfers** | Inter-location moves (**decrease** stock when status = completed) |",
        "| **ERP — Cash handovers** | Cash custody transfers |",
        "",
        "### Product stock",
        "",
        "- **`stock`** on `Product` is required on create/bulk (`number`, ≥ 0).",
        "- Manual adjust: `PATCH /products/{id}/stock/increase` or `…/decrease` with `{ \"quantity\": n }`.",
        "- Oil seed (`POST /products/seed/oil-catalog`) sets each SKU to catalog default stock (500).",
        "- ERP documents adjust stock automatically (see tags above); insufficient stock returns **400**.",
    ].join("\n"))
        .setVersion("1.0")
        .addBearerAuth()
        .addTag(api_tags_1.SwaggerTags.Health, "Liveness and system information")
        .addTag(api_tags_1.SwaggerTags.Authentication, "Login, registration, JWT, profile")
        .addTag(api_tags_1.SwaggerTags.Users, "User administration and profile updates")
        .addTag(api_tags_1.SwaggerTags.Centers, "Distribution centers (legacy ERP parity)")
        .addTag(api_tags_1.SwaggerTags.Vehicles, "Vehicles assigned to centers")
        .addTag(api_tags_1.SwaggerTags.Products, "Catalog with required stock, bulk/seed import, stock increase/decrease, location inventory rows")
        .addTag(api_tags_1.SwaggerTags.ErpCustomers, "Customer master data")
        .addTag(api_tags_1.SwaggerTags.ErpInvoices, "Sales invoices; creating an invoice decreases product stock per line")
        .addTag(api_tags_1.SwaggerTags.ErpSalesReturns, "Sales returns; creating a return increases product stock per line")
        .addTag(api_tags_1.SwaggerTags.ErpPayments, "Customer payments")
        .addTag(api_tags_1.SwaggerTags.ErpVehicleTrips, "Trip logs and odometer")
        .addTag(api_tags_1.SwaggerTags.ErpExpenses, "Operating expenses")
        .addTag(api_tags_1.SwaggerTags.ErpPurchases, "Purchase orders (increase stock on lines with productId); distributions decrease stock")
        .addTag(api_tags_1.SwaggerTags.ErpCurrencyExchanges, "FX desk operations")
        .addTag(api_tags_1.SwaggerTags.ErpInventoryTransfers, "Transfers between centers/vehicles; completing a transfer decreases product stock")
        .addTag(api_tags_1.SwaggerTags.ErpCashHandovers, "Cash handovers between roles / centers")
        .build();
    return swagger_1.SwaggerModule.createDocument(app, config, { extraModels });
}
function logOpenApiProductPaths(document) {
    const productPaths = Object.keys(document.paths ?? {}).filter((p) => p.includes("/products"));
    const highlights = productPaths.filter((p) => p.includes("bulk") ||
        p.includes("seed") ||
        p.includes("/stock/"));
    console.log(`[Swagger] ${productPaths.length} /products/* path(s):`, productPaths.join(", ") || "(none)");
    if (highlights.length) {
        console.log(`[Swagger] product highlights: ${highlights.join(", ")}`);
    }
    else {
        console.warn("[Swagger] WARNING: expected /products/bulk, /products/seed/oil-catalog, or /stock/* routes missing — rebuild and restart");
    }
}
function setupSwagger(app) {
    const buildDocument = () => buildOpenApiDocument(app);
    const initialDocument = buildDocument();
    logOpenApiProductPaths(initialDocument);
    swagger_1.SwaggerModule.setup("docs", app, initialDocument, {
        jsonDocumentUrl: "docs-json",
        yamlDocumentUrl: "docs-yaml",
        patchDocumentOnRequest: () => buildDocument(),
        customSiteTitle: `Oil Sales API · ${OPENAPI_BUILD_TIME}`,
        swaggerOptions: {
            persistAuthorization: true,
            docExpansion: "list",
            url: "/docs-json",
            deepLinking: true,
        },
    });
}
//# sourceMappingURL=setup-swagger.js.map