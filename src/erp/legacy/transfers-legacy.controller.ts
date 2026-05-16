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
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { Roles } from "src/auth/decorators/roles.decorator";
import { UserRole, ERP_MANAGEMENT_ROLES } from "src/users/enums/user-role.enum";
import { ErpInventoryTransfersService } from "src/erp/inventory-transfers.service";
import {
	CreateInventoryTransferDto,
	UpdateInventoryTransferDto,
} from "src/erp/dto/documents.dto";

@ApiTags("Transfers (legacy)")
@Controller("transfers")
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class TransfersLegacyController {
	constructor(private readonly transfers: ErpInventoryTransfersService) {}

	@Get()
	@Roles(...ERP_MANAGEMENT_ROLES)
	findAll() {
		return this.transfers.findAll();
	}

	@Get(":id")
	@Roles(...ERP_MANAGEMENT_ROLES)
	findOne(@Param("id", ParseIntPipe) id: number) {
		return this.transfers.findOne(id);
	}

	@Post()
	@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
	create(@Body() dto: CreateInventoryTransferDto) {
		return this.transfers.create(dto);
	}

	@Patch(":id/complete")
	@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
	complete(@Param("id", ParseIntPipe) id: number) {
		return this.transfers.complete(id);
	}

	@Patch(":id/cancel")
	@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
	cancel(@Param("id", ParseIntPipe) id: number) {
		return this.transfers.cancel(id);
	}

	@Patch(":id")
	@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
	update(
		@Param("id", ParseIntPipe) id: number,
		@Body() dto: UpdateInventoryTransferDto,
	) {
		return this.transfers.update(id, dto);
	}
}
