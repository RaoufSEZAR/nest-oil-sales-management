import {
	Controller,
	Get,
	Param,
	ParseIntPipe,
	Query,
	UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { Roles } from "src/auth/decorators/roles.decorator";
import { ERP_MANAGEMENT_ROLES } from "src/users/enums/user-role.enum";
import {
	ReportsService,
	ReportDateFilters,
} from "src/erp/reports/reports.service";

@ApiTags("Reports")
@Controller("reports")
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ReportsController {
	constructor(private readonly reports: ReportsService) {}

	private filters(
		from_date?: string,
		to_date?: string,
		sales_rep_id?: string,
		customer_id?: string,
		center_id?: string,
		status?: string,
	): ReportDateFilters {
		return {
			from_date,
			to_date,
			sales_rep_id,
			customer_id: customer_id ? parseInt(customer_id, 10) : undefined,
			center_id: center_id ? parseInt(center_id, 10) : undefined,
			status,
		};
	}

	@Get("sales")
	@Roles(...ERP_MANAGEMENT_ROLES)
	@ApiOperation({ summary: "Sales report (legacy GET /reports/sales)" })
	@ApiQuery({ name: "from_date", required: false })
	@ApiQuery({ name: "to_date", required: false })
	@ApiQuery({ name: "sales_rep_id", required: false })
	@ApiQuery({ name: "customer_id", required: false })
	getSalesReport(
		@Query("from_date") from_date?: string,
		@Query("to_date") to_date?: string,
		@Query("sales_rep_id") sales_rep_id?: string,
		@Query("customer_id") customer_id?: string,
	) {
		return this.reports.getSalesReport(
			this.filters(from_date, to_date, sales_rep_id, customer_id),
		);
	}

	@Get("vehicles/:vehicle_id")
	@Roles(...ERP_MANAGEMENT_ROLES)
	@ApiOperation({ summary: "Vehicle report" })
	getVehicleReport(
		@Param("vehicle_id", ParseIntPipe) vehicleId: number,
		@Query("from_date") from_date?: string,
		@Query("to_date") to_date?: string,
	) {
		return this.reports.getVehicleReport(
			vehicleId,
			this.filters(from_date, to_date),
		);
	}

	@Get("centers/:center_id")
	@Roles(...ERP_MANAGEMENT_ROLES)
	@ApiOperation({ summary: "Center report" })
	getCenterReport(
		@Param("center_id", ParseIntPipe) centerId: number,
		@Query("from_date") from_date?: string,
		@Query("to_date") to_date?: string,
	) {
		return this.reports.getCenterReport(
			centerId,
			this.filters(from_date, to_date),
		);
	}

	@Get("admin")
	@Roles(...ERP_MANAGEMENT_ROLES)
	@ApiOperation({ summary: "Admin dashboard summary" })
	getAdminReport(
		@Query("from_date") from_date?: string,
		@Query("to_date") to_date?: string,
	) {
		return this.reports.getAdminReport(this.filters(from_date, to_date));
	}

	@Get("inventory")
	@Roles(...ERP_MANAGEMENT_ROLES)
	@ApiOperation({ summary: "Inventory report" })
	getInventoryReport() {
		return this.reports.getInventoryReport();
	}

	@Get("centers-comparison")
	@Roles(...ERP_MANAGEMENT_ROLES)
	@ApiOperation({ summary: "Centers comparison" })
	getCentersComparison(
		@Query("from_date") from_date?: string,
		@Query("to_date") to_date?: string,
	) {
		return this.reports.getCentersComparison(this.filters(from_date, to_date));
	}

	@Get("cash-audit")
	@Roles(...ERP_MANAGEMENT_ROLES)
	@ApiOperation({ summary: "Cash handover audit" })
	getCashAudit(
		@Query("from_date") from_date?: string,
		@Query("to_date") to_date?: string,
		@Query("center_id") center_id?: string,
	) {
		return this.reports.getCashAudit(
			this.filters(from_date, to_date, undefined, undefined, center_id),
		);
	}
}
