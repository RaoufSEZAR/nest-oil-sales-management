import {
	Body,
	Controller,
	Get,
	Param,
	Patch,
	Post,
	ParseIntPipe,
	UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { Roles } from "src/auth/decorators/roles.decorator";
import { UserRole } from "src/users/enums/user-role.enum";
import { ErpPurchasesService } from "src/erp/purchases.service";
import {
	CreatePurchaseDto,
	CreatePurchaseDistributionDto,
	UpdatePurchaseDto,
} from "src/erp/dto/documents.dto";
import { SwaggerTags } from "src/swagger/api-tags";

@ApiTags(SwaggerTags.ErpPurchases)
@Controller("purchases")
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ErpPurchasesController {
	constructor(private readonly purchases: ErpPurchasesService) {}

	@Get()
	@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.MANAGER)
	@ApiOperation({ summary: "List purchases" })
	findAll() {
		return this.purchases.findAll();
	}

	@Get(":id")
	@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.MANAGER)
	@ApiOperation({ summary: "Get purchase by id" })
	findOne(@Param("id", ParseIntPipe) id: number) {
		return this.purchases.findOne(id);
	}

	@Post()
	@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
	@ApiOperation({
		summary: "Create purchase with line items",
		description:
			"Increases **product stock** for each line that includes a `productId`.",
	})
	create(@Body() dto: CreatePurchaseDto) {
		return this.purchases.create(dto);
	}

	@Patch(":id")
	@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
	@ApiOperation({ summary: "Update purchase header fields" })
	update(
		@Param("id", ParseIntPipe) id: number,
		@Body() dto: UpdatePurchaseDto,
	) {
		return this.purchases.update(id, dto);
	}

	@Post(":id/distributions")
	@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
	@ApiOperation({
		summary: "Record stock distribution for a purchase",
		description:
			"Decreases **product stock** by the distributed quantity when sending stock to a center.",
	})
	addDistribution(
		@Param("id", ParseIntPipe) id: number,
		@Body() dto: CreatePurchaseDistributionDto,
	) {
		return this.purchases.addDistribution(id, dto);
	}
}
