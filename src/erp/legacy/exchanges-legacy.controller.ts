import {
	Body,
	Controller,
	Get,
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
import { ErpCurrencyExchangesService } from "src/erp/currency-exchanges.service";
import { CreateCurrencyExchangeDto } from "src/erp/dto/documents.dto";

@ApiTags("Exchanges (legacy)")
@Controller("exchanges")
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ExchangesLegacyController {
	constructor(private readonly exchanges: ErpCurrencyExchangesService) {}

	@Get()
	@Roles(...ERP_MANAGEMENT_ROLES)
	findAll() {
		return this.exchanges.findAll();
	}

	@Get(":id")
	@Roles(...ERP_MANAGEMENT_ROLES)
	findOne(@Param("id", ParseIntPipe) id: number) {
		return this.exchanges.findOne(id);
	}

	@Post()
	@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
	create(@Body() dto: CreateCurrencyExchangeDto) {
		return this.exchanges.create(dto);
	}
}
