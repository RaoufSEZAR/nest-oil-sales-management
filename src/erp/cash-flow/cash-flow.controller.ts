import {
	Body,
	Controller,
	Get,
	Post,
	Request,
	UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { Roles } from "src/auth/decorators/roles.decorator";
import { UserRole, ERP_MANAGEMENT_ROLES } from "src/users/enums/user-role.enum";
import { CashFlowService } from "src/erp/cash-flow/cash-flow.service";

@ApiTags("Cash-flow")
@Controller("cash-flow")
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class CashFlowController {
	constructor(private readonly cashFlow: CashFlowService) {}

	@Get("me")
	@Roles(...ERP_MANAGEMENT_ROLES, UserRole.USER)
	@ApiOperation({ summary: "Sales rep cash ledger (legacy GET /cash-flow/me)" })
	getMyCashFlow(@Request() req: { user: { userId: string } }) {
		return this.cashFlow.getMyCashFlow(req.user.userId);
	}

	@Post("validate-handover")
	@Roles(...ERP_MANAGEMENT_ROLES, UserRole.USER)
	@ApiOperation({ summary: "Validate handover amount against balance" })
	validateHandover(
		@Request() req: { user: { userId: string } },
		@Body() body: { currency?: string; amount?: number },
	) {
		return this.cashFlow.validateHandover(req.user.userId, body);
	}
}
