import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from "@nestjs/swagger";
import { CreateCenterDto } from "src/centers/dto/create-center.dto";
import { UpdateCenterDto } from "src/centers/dto/update-center.dto";
import { Center } from "src/centers/entities/center.entity";
import { CreateVehicleDto } from "src/vehicles/dto/create-vehicle.dto";
import { UpdateVehicleDto } from "src/vehicles/dto/update-vehicle.dto";
import { Vehicle } from "src/vehicles/entities/vehicle.entity";
import { CreateProductDto } from "src/products/dto/create-product.dto";
import { UpdateProductDto } from "src/products/dto/update-product.dto";
import { BulkUpsertProductsDto } from "src/products/dto/bulk-upsert-products.dto";
import {
	BulkUpsertProductErrorDto,
	BulkUpsertProductsResultDto,
} from "src/products/dto/bulk-upsert-result.dto";
import { Product, Inventory } from "src/products/entities/product.entity";
import { SwaggerTags } from "src/swagger/api-tags";

const extraModels = [
	Center,
	CreateCenterDto,
	UpdateCenterDto,
	Vehicle,
	CreateVehicleDto,
	UpdateVehicleDto,
	Product,
	Inventory,
	CreateProductDto,
	UpdateProductDto,
	BulkUpsertProductsDto,
	BulkUpsertProductsResultDto,
	BulkUpsertProductErrorDto,
];

/** Shown in Swagger UI so you can confirm the running process picked up latest routes */
const OPENAPI_BUILD_TIME = new Date().toISOString();

export function buildOpenApiDocument(app: INestApplication): OpenAPIObject {
	const config = new DocumentBuilder()
		.setTitle("Oil Sales API")
		.setDescription(
			[
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
			].join("\n"),
		)
		.setVersion("1.0")
		.addBearerAuth()
		.addTag(SwaggerTags.Health, "Liveness and system information")
		.addTag(SwaggerTags.Authentication, "Login, registration, JWT, profile")
		.addTag(SwaggerTags.Users, "User administration and profile updates")
		.addTag(SwaggerTags.Centers, "Distribution centers (legacy ERP parity)")
		.addTag(SwaggerTags.Vehicles, "Vehicles assigned to centers")
		.addTag(
			SwaggerTags.Products,
			"Product catalog, bulk import (`POST /products/bulk`), one-click oil seed (`POST /products/seed/oil-catalog`), inventory rows, soft delete",
		)
		.addTag(SwaggerTags.ErpCustomers, "Customer master data")
		.addTag(SwaggerTags.ErpInvoices, "Sales invoices and line items")
		.addTag(SwaggerTags.ErpSalesReturns, "Returns and line items")
		.addTag(SwaggerTags.ErpPayments, "Customer payments")
		.addTag(SwaggerTags.ErpVehicleTrips, "Trip logs and odometer")
		.addTag(SwaggerTags.ErpExpenses, "Operating expenses")
		.addTag(SwaggerTags.ErpPurchases, "Purchase orders and distributions")
		.addTag(SwaggerTags.ErpCurrencyExchanges, "FX desk operations")
		.addTag(SwaggerTags.ErpInventoryTransfers, "Inter-location stock transfers")
		.addTag(SwaggerTags.ErpCashHandovers, "Cash handovers between roles / centers")
		.build();

	return SwaggerModule.createDocument(app, config, { extraModels });
}

export function logOpenApiProductPaths(document: OpenAPIObject): void {
	const productPaths = Object.keys(document.paths ?? {}).filter((p) =>
		p.includes("/products"),
	);
	const highlights = productPaths.filter(
		(p) => p.includes("bulk") || p.includes("seed"),
	);
	console.log(
		`[Swagger] ${productPaths.length} /products/* path(s):`,
		productPaths.join(", ") || "(none)",
	);
	if (highlights.length) {
		console.log(`[Swagger] bulk/seed routes: ${highlights.join(", ")}`);
	} else {
		console.warn(
			"[Swagger] WARNING: POST /products/bulk or /products/seed/oil-catalog missing — rebuild and restart the API",
		);
	}
}

export function setupSwagger(app: INestApplication): void {
	const buildDocument = () => buildOpenApiDocument(app);

	const initialDocument = buildDocument();
	logOpenApiProductPaths(initialDocument);

	// UI loads spec from /docs-json (not a stale inlined bundle). patchDocumentOnRequest
	// rebuilds the document on every docs + docs-json request.
	SwaggerModule.setup("docs", app, initialDocument, {
		jsonDocumentUrl: "docs-json",
		yamlDocumentUrl: "docs-yaml",
		patchDocumentOnRequest: () => buildDocument(),
		customSiteTitle: `Oil Sales API · ${OPENAPI_BUILD_TIME}`,
		swaggerOptions: {
			persistAuthorization: true,
			docExpansion: "list",
			// Load live OpenAPI JSON (avoids stale inlined spec in swagger-ui-init.js)
			url: "/docs-json",
			// Hash deep links without spaces (see api-tags.ts)
			deepLinking: true,
		},
	});
}
