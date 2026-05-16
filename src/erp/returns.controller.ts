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
import { ErpReturnsService } from "src/erp/returns.service";
import { CreateSalesReturnDto } from "src/erp/dto/documents.dto";
import { SwaggerTags } from "src/swagger/api-tags";

@ApiTags(SwaggerTags.ErpSalesReturns)
@Controller("returns")
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ErpReturnsController {
	constructor(private readonly returns: ErpReturnsService) {}

	@Get()
	@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.MANAGER)
	@ApiOperation({ summary: "List sales returns" })
	findAll() {
		return this.returns.findAll();
	}

	@Get(":id")
	@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.MANAGER)
	@ApiOperation({ summary: "Get return by id" })
	findOne(@Param("id", ParseIntPipe) id: number) {
		return this.returns.findOne(id);
	}

	@Post()
	@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
	@ApiOperation({ summary: "Create sales return" })
	create(@Body() dto: CreateSalesReturnDto) {
		return this.returns.create(dto);
	}
}
