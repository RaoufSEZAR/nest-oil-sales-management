import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { CreateCenterDto } from "src/centers/dto/create-center.dto";
import { UpdateCenterDto } from "src/centers/dto/update-center.dto";
import { Center } from "src/centers/entities/center.entity";
import { CreateVehicleDto } from "src/vehicles/dto/create-vehicle.dto";
import { UpdateVehicleDto } from "src/vehicles/dto/update-vehicle.dto";
import { Vehicle } from "src/vehicles/entities/vehicle.entity";
import { CreateProductDto } from "src/products/dto/create-product.dto";
import { UpdateProductDto } from "src/products/dto/update-product.dto";
import { Product, Inventory } from "src/products/entities/product.entity";

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
];

export function setupSwagger(app: INestApplication): void {
	const config = new DocumentBuilder()
		.setTitle("Oil Sales API")
		.setDescription(
			[
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
			].join("\n"),
		)
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

	const buildDocument = () =>
		SwaggerModule.createDocument(app, config, {
			extraModels,
		});

	// Initial document for Nest; UI uses patchDocumentOnRequest for a fresh spec each load.
	const initialDocument = buildDocument();

	SwaggerModule.setup("docs", app, initialDocument, {
		// Top-level option (see Nest SwaggerCustomOptions) — disables cached swagger-ui-init.js
		// so the embedded OpenAPI always matches the running app (Centers / Vehicles / Products, etc.).
		patchDocumentOnRequest: (_req, _res, _document) => buildDocument(),
		swaggerOptions: {
			persistAuthorization: true,
			docExpansion: "list",
		},
	});
}
