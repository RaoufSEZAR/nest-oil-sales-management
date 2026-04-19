import {
	Body,
	Controller,
	Get,
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
import { ErpCurrencyExchangesService } from "src/erp/currency-exchanges.service";
import { CreateCurrencyExchangeDto } from "src/erp/dto/documents.dto";

@ApiTags("ERP — Currency exchanges")
@Controller("currency-exchanges")
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ErpCurrencyExchangesController {
	constructor(private readonly exchanges: ErpCurrencyExchangesService) {}

	@Get()
	@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.MANAGER)
	@ApiOperation({ summary: "List currency exchanges" })
	findAll() {
		return this.exchanges.findAll();
	}

	@Get(":id")
	@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.MANAGER)
	@ApiOperation({ summary: "Get exchange by id" })
	findOne(@Param("id", ParseIntPipe) id: number) {
		return this.exchanges.findOne(id);
	}

	@Post()
	@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
	@ApiOperation({ summary: "Create currency exchange" })
	create(@Body() dto: CreateCurrencyExchangeDto) {
		return this.exchanges.create(dto);
	}
}
