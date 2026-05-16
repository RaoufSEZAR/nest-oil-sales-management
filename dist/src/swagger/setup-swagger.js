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
        "| **Products** | Catalog, `POST /products/bulk`, `POST /products/seed/oil-catalog`, inventory, soft delete |",
        "| **ERP — Customers** | Customer master data |",
        "| **ERP — Invoices** | Sales invoices and line items |",
        "| **ERP — Sales returns** | Returns linked to customers / invoices |",
        "| **ERP — Payments** | Customer payments |",
        "| **ERP — Vehicle trips** | Trip logs and odometer |",
        "| **ERP — Expenses** | Center expenses |",
        "| **ERP — Purchases** | Supplier POs, lines, distributions |",
        "| **ERP — Currency exchanges** | FX desk operations |",
        "| **ERP — Inventory transfers** | Stock moves between centers / vehicles |",
        "| **ERP — Cash handovers** | Cash custody transfers |",
    ].join("\n"))
        .setVersion("1.0")
        .addBearerAuth()
        .addTag(api_tags_1.SwaggerTags.Health, "Liveness and system information")
        .addTag(api_tags_1.SwaggerTags.Authentication, "Login, registration, JWT, profile")
        .addTag(api_tags_1.SwaggerTags.Users, "User administration and profile updates")
        .addTag(api_tags_1.SwaggerTags.Centers, "Distribution centers (legacy ERP parity)")
        .addTag(api_tags_1.SwaggerTags.Vehicles, "Vehicles assigned to centers")
        .addTag(api_tags_1.SwaggerTags.Products, "Product catalog, bulk import (`POST /products/bulk`), one-click oil seed (`POST /products/seed/oil-catalog`), inventory rows, soft delete")
        .addTag(api_tags_1.SwaggerTags.ErpCustomers, "Customer master data")
        .addTag(api_tags_1.SwaggerTags.ErpInvoices, "Sales invoices and line items")
        .addTag(api_tags_1.SwaggerTags.ErpSalesReturns, "Returns and line items")
        .addTag(api_tags_1.SwaggerTags.ErpPayments, "Customer payments")
        .addTag(api_tags_1.SwaggerTags.ErpVehicleTrips, "Trip logs and odometer")
        .addTag(api_tags_1.SwaggerTags.ErpExpenses, "Operating expenses")
        .addTag(api_tags_1.SwaggerTags.ErpPurchases, "Purchase orders and distributions")
        .addTag(api_tags_1.SwaggerTags.ErpCurrencyExchanges, "FX desk operations")
        .addTag(api_tags_1.SwaggerTags.ErpInventoryTransfers, "Inter-location stock transfers")
        .addTag(api_tags_1.SwaggerTags.ErpCashHandovers, "Cash handovers between roles / centers")
        .build();
    return swagger_1.SwaggerModule.createDocument(app, config, { extraModels });
}
function logOpenApiProductPaths(document) {
    const productPaths = Object.keys(document.paths ?? {}).filter((p) => p.includes("/products"));
    const highlights = productPaths.filter((p) => p.includes("bulk") || p.includes("seed"));
    console.log(`[Swagger] ${productPaths.length} /products/* path(s):`, productPaths.join(", ") || "(none)");
    if (highlights.length) {
        console.log(`[Swagger] bulk/seed routes: ${highlights.join(", ")}`);
    }
    else {
        console.warn("[Swagger] WARNING: POST /products/bulk or /products/seed/oil-catalog missing — rebuild and restart the API");
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