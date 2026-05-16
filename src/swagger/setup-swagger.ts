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
import { AdjustProductStockDto } from "src/products/dto/adjust-product-stock.dto";
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
	AdjustProductStockDto,
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
			"Catalog with required stock, bulk/seed import, stock increase/decrease, location inventory rows",
		)
		.addTag(SwaggerTags.ErpCustomers, "Customer master data")
		.addTag(
			SwaggerTags.ErpInvoices,
			"Sales invoices; creating an invoice decreases product stock per line",
		)
		.addTag(
			SwaggerTags.ErpSalesReturns,
			"Sales returns; creating a return increases product stock per line",
		)
		.addTag(SwaggerTags.ErpPayments, "Customer payments")
		.addTag(SwaggerTags.ErpVehicleTrips, "Trip logs and odometer")
		.addTag(SwaggerTags.ErpExpenses, "Operating expenses")
		.addTag(
			SwaggerTags.ErpPurchases,
			"Purchase orders (increase stock on lines with productId); distributions decrease stock",
		)
		.addTag(SwaggerTags.ErpCurrencyExchanges, "FX desk operations")
		.addTag(
			SwaggerTags.ErpInventoryTransfers,
			"Transfers between centers/vehicles; completing a transfer decreases product stock",
		)
		.addTag(SwaggerTags.ErpCashHandovers, "Cash handovers between roles / centers")
		.build();

	return SwaggerModule.createDocument(app, config, { extraModels });
}

export function logOpenApiProductPaths(document: OpenAPIObject): void {
	const productPaths = Object.keys(document.paths ?? {}).filter((p) =>
		p.includes("/products"),
	);
	const highlights = productPaths.filter(
		(p) =>
			p.includes("bulk") ||
			p.includes("seed") ||
			p.includes("/stock/"),
	);
	console.log(
		`[Swagger] ${productPaths.length} /products/* path(s):`,
		productPaths.join(", ") || "(none)",
	);
	if (highlights.length) {
		console.log(`[Swagger] product highlights: ${highlights.join(", ")}`);
	} else {
		console.warn(
			"[Swagger] WARNING: expected /products/bulk, /products/seed/oil-catalog, or /stock/* routes missing — rebuild and restart",
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
