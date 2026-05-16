import {
	Body,
	Controller,
	Get,
	Patch,
	Param,
	Post,
	ParseIntPipe,
	UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { Roles } from "src/auth/decorators/roles.decorator";
import { UserRole } from "src/users/enums/user-role.enum";
import { ErpInventoryTransfersService } from "src/erp/inventory-transfers.service";
import {
	CreateInventoryTransferDto,
	UpdateInventoryTransferDto,
} from "src/erp/dto/documents.dto";
import { SwaggerTags } from "src/swagger/api-tags";

@ApiTags(SwaggerTags.ErpInventoryTransfers)
@Controller("inventory-transfers")
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ErpInventoryTransfersController {
	constructor(private readonly transfers: ErpInventoryTransfersService) {}

	@Get()
	@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.MANAGER)
	@ApiOperation({ summary: "List inventory transfers" })
	findAll() {
		return this.transfers.findAll();
	}

	@Get(":id")
	@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.MANAGER)
	@ApiOperation({ summary: "Get transfer by id" })
	findOne(@Param("id", ParseIntPipe) id: number) {
		return this.transfers.findOne(id);
	}

	@Post()
	@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
	@ApiOperation({
		summary: "Create transfer with line items",
		description:
			"If status is **completed** on create, decreases **product stock** per line immediately.",
	})
	create(@Body() dto: CreateInventoryTransferDto) {
		return this.transfers.create(dto);
	}

	@Patch(":id")
	@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
	@ApiOperation({
		summary: "Update transfer status / receiver",
		description:
			"When status changes to **completed**, decreases **product stock** for each line (once).",
	})
	update(
		@Param("id", ParseIntPipe) id: number,
		@Body() dto: UpdateInventoryTransferDto,
	) {
		return this.transfers.update(id, dto);
	}

	@Patch(":id/complete")
	@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
	@ApiOperation({ summary: "Complete transfer (legacy)" })
	complete(@Param("id", ParseIntPipe) id: number) {
		return this.transfers.complete(id);
	}

	@Patch(":id/cancel")
	@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
	@ApiOperation({ summary: "Cancel transfer (legacy)" })
	cancel(@Param("id", ParseIntPipe) id: number) {
		return this.transfers.cancel(id);
	}
}
