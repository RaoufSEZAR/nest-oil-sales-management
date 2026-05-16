import {
	Body,
	Controller,
	Get,
	Patch,
	Param,
	ParseIntPipe,
	Query,
	Request,
	UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { Roles } from "src/auth/decorators/roles.decorator";
import { UserRole, ERP_MANAGEMENT_ROLES } from "src/users/enums/user-role.enum";
import { InventoryService } from "src/products/inventory.service";
import { InventoryLocationType } from "src/products/enums/inventory-location-type.enum";
import { SwaggerTags } from "src/swagger/api-tags";
import { parseOptionalInt } from "src/common/utils/query-filters";
import { UsersService } from "src/users/users.service";

@ApiTags("Inventory")
@Controller("inventory")
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class InventoryController {
	constructor(
		private readonly inventory: InventoryService,
		private readonly usersService: UsersService,
	) {}

	@Get()
	@Roles(...ERP_MANAGEMENT_ROLES, UserRole.USER)
	@ApiOperation({ summary: "Inventory by location (legacy GET /inventory)" })
	@ApiQuery({ name: "location_type", required: false, enum: InventoryLocationType })
	@ApiQuery({ name: "location_id", required: false, type: Number })
	async getInventory(
		@Query("location_type") locationType?: InventoryLocationType,
		@Query("location_id") locationIdRaw?: string,
		@Request() req?: { user: { userId: string; role: UserRole } },
	) {
		let locationId = parseOptionalInt(locationIdRaw);
		let type = locationType;

		if (req?.user.role === UserRole.USER) {
			const user = await this.usersService.findOne(req.user.userId);
			type = InventoryLocationType.VEHICLE;
			locationId = user.vehicleId ?? locationId;
		}

		return this.inventory.findByLocation({
			locationType: type,
			locationId,
		});
	}

	@Get("alerts/low-stock")
	@Roles(...ERP_MANAGEMENT_ROLES)
	@ApiOperation({ summary: "Low stock alerts (legacy GET /inventory/alerts)" })
	getLowStockAlerts(@Query("threshold") thresholdRaw?: string) {
		const threshold = thresholdRaw ? parseInt(thresholdRaw, 10) : 10;
		return this.inventory.getLowStockAlerts(
			Number.isFinite(threshold) ? threshold : 10,
		);
	}

	@Get("product/:product_id")
	@Roles(...ERP_MANAGEMENT_ROLES)
	@ApiOperation({ summary: "Product inventory across locations" })
	getProductInventory(@Param("product_id", ParseIntPipe) productId: number) {
		return this.inventory.findByProduct(productId);
	}

	@Patch("product/:product_id")
	@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
	@ApiOperation({ summary: "Update inventory quantity at a location" })
	updateInventory(
		@Param("product_id", ParseIntPipe) productId: number,
		@Body()
		body: {
			location_type: InventoryLocationType;
			location_id: number;
			quantity: number;
		},
	) {
		return this.inventory.updateQuantity(
			productId,
			body.location_type,
			body.location_id,
			body.quantity,
		);
	}
}
