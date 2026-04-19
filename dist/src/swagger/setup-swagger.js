"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
const product_entity_1 = require("../products/entities/product.entity");
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
];
function setupSwagger(app) {
    const config = new swagger_1.DocumentBuilder()
        .setTitle("Oil Sales API")
        .setDescription([
        "REST API for Oil Sales (NestJS + PostgreSQL + TypeORM).",
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
        "| **Products** | Catalog, categories, inventory lines, soft delete |",
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
        .addTag("Health", "Liveness and system information")
        .addTag("Authentication", "Login, registration, JWT, profile")
        .addTag("Users", "User administration and profile updates")
        .addTag("Centers", "Distribution centers (legacy ERP parity)")
        .addTag("Vehicles", "Vehicles assigned to centers")
        .addTag("Products", "Product catalog and related inventory rows")
        .addTag("ERP — Customers", "Customer master data")
        .addTag("ERP — Invoices", "Sales invoices and line items")
        .addTag("ERP — Sales returns", "Returns and line items")
        .addTag("ERP — Payments", "Customer payments")
        .addTag("ERP — Vehicle trips", "Fleet trip tracking")
        .addTag("ERP — Expenses", "Operating expenses")
        .addTag("ERP — Purchases", "Purchase orders and distributions")
        .addTag("ERP — Currency exchanges", "FX operations")
        .addTag("ERP — Inventory transfers", "Inter-location stock transfers")
        .addTag("ERP — Cash handovers", "Cash handovers between roles / centers")
        .build();
    const buildDocument = () => swagger_1.SwaggerModule.createDocument(app, config, {
        extraModels,
    });
    const initialDocument = buildDocument();
    swagger_1.SwaggerModule.setup("docs", app, initialDocument, {
        patchDocumentOnRequest: (_req, _res, _document) => buildDocument(),
        swaggerOptions: {
            persistAuthorization: true,
            docExpansion: "list",
        },
    });
}
//# sourceMappingURL=setup-swagger.js.map