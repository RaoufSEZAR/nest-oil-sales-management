import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Between, Repository } from "typeorm";
import { Invoice } from "src/erp/entities/invoice.entity";
import { Customer } from "src/erp/entities/customer.entity";
import { Payment } from "src/erp/entities/payment.entity";
import { VehicleTrip } from "src/erp/entities/vehicle-trip.entity";
import { CashHandover } from "src/erp/entities/cash-handover.entity";
import { Product, Inventory } from "src/products/entities/product.entity";
import { Center } from "src/centers/entities/center.entity";
import { Vehicle } from "src/vehicles/entities/vehicle.entity";
import { CashHandoverStatus } from "src/erp/enums/cash-handover-status.enum";
import { dateRangeWhere } from "src/common/utils/query-filters";

export interface ReportDateFilters {
	from_date?: string;
	to_date?: string;
	sales_rep_id?: string;
	customer_id?: number;
	center_id?: number;
	status?: string;
}

@Injectable()
export class ReportsService {
	constructor(
		@InjectRepository(Invoice) private readonly invoices: Repository<Invoice>,
		@InjectRepository(Customer) private readonly customers: Repository<Customer>,
		@InjectRepository(Payment) private readonly payments: Repository<Payment>,
		@InjectRepository(VehicleTrip) private readonly trips: Repository<VehicleTrip>,
		@InjectRepository(CashHandover)
		private readonly handovers: Repository<CashHandover>,
		@InjectRepository(Product) private readonly products: Repository<Product>,
		@InjectRepository(Inventory) private readonly inventory: Repository<Inventory>,
		@InjectRepository(Center) private readonly centers: Repository<Center>,
		@InjectRepository(Vehicle) private readonly vehicles: Repository<Vehicle>,
	) {}

	async getSalesReport(filters: ReportDateFilters) {
		const where: Record<string, unknown> = {};
		const dateFilter = dateRangeWhere(filters.from_date, filters.to_date);
		if (dateFilter) where.date = dateFilter;
		if (filters.sales_rep_id) where.salesRep = { id: filters.sales_rep_id };
		if (filters.customer_id) where.customer = { id: filters.customer_id };

		const rows = await this.invoices.find({
			where,
			relations: { customer: true, salesRep: true },
			order: { date: "DESC" },
		});

		let totalSales = 0;
		let totalPaidUsd = 0;
		let totalPending = 0;

		for (const inv of rows) {
			const total = parseFloat(inv.totalAmount || "0");
			totalSales += total;
			const cur = (inv.currency || "USD").toUpperCase();
			const rate = parseFloat(inv.exchangeRate || "1");
			const paid = parseFloat(inv.paidAmount || "0");
			const paidUsd = cur === "USD" ? paid : paid / rate;
			totalPaidUsd += paidUsd;
			totalPending += Math.max(0, total - paidUsd);
		}

		return {
			invoices: rows,
			stats: {
				total_invoices: rows.length,
				total_sales: totalSales,
				total_paid_usd: totalPaidUsd,
				total_pending: totalPending,
			},
		};
	}

	async getVehicleReport(vehicleId: number, filters: ReportDateFilters) {
		const vehicle = await this.vehicles.findOne({
			where: { id: vehicleId },
			relations: { center: true },
		});
		if (!vehicle) throw new NotFoundException("Vehicle not found");

		const tripWhere: Record<string, unknown> = { vehicle: { id: vehicleId } };
		const dateFilter = dateRangeWhere(filters.from_date, filters.to_date);
		if (dateFilter) tripWhere.tripDate = dateFilter;

		const trips = await this.trips.find({
			where: tripWhere,
			relations: { salesRep: true },
			order: { tripDate: "DESC" },
			take: 20,
		});

		const invWhere: Record<string, unknown> = {};
		if (dateFilter) invWhere.date = dateFilter;

		const invoices = await this.invoices.find({
			where: invWhere,
			relations: { customer: true, salesRep: true },
		});

		const vehicleInvoices = invoices.filter(
			(inv) => inv.trip?.vehicle?.id === vehicleId,
		);

		return { vehicle, trips, invoices: vehicleInvoices };
	}

	async getCenterReport(centerId: number, filters: ReportDateFilters) {
		const center = await this.centers.findOne({ where: { id: centerId } });
		if (!center) throw new NotFoundException("Center not found");

		const payments = await this.payments.find({
			where: {
				paymentDate: filters.from_date && filters.to_date
					? Between(new Date(filters.from_date), new Date(filters.to_date))
					: undefined,
			},
			relations: { customer: true, receivedBy: true },
			order: { paymentDate: "DESC" },
			take: 100,
		});

		return { center, payments };
	}

	async getAdminReport(filters: ReportDateFilters) {
		const [sales, customers, products] = await Promise.all([
			this.getSalesReport(filters),
			this.customers.count(),
			this.products.count({ where: { active: true } }),
		]);

		return {
			sales_stats: sales.stats,
			customer_count: customers,
			active_products: products,
		};
	}

	async getInventoryReport() {
		const products = await this.products.find({ where: { active: true } });
		const locations = await this.inventory.find({ relations: { product: true } });

		const totalWarehouse = products.reduce(
			(s, p) => s + parseFloat(p.stock || "0"),
			0,
		);

		return {
			warehouse: products,
			locations,
			stats: {
				product_count: products.length,
				location_rows: locations.length,
				total_warehouse_qty: totalWarehouse,
			},
		};
	}

	async getCentersComparison(filters: ReportDateFilters) {
		const centers = await this.centers.find({ where: { active: true } });
		const result = [];
		for (const center of centers) {
			const handoverWhere: Record<string, unknown> = {
				toType: "center",
				toId: center.id,
			};
			if (filters?.from_date && filters?.to_date) {
				handoverWhere.handoverDate = Between(
					new Date(filters.from_date),
					new Date(filters.to_date),
				);
			}
			const handovers = await this.handovers.find({ where: handoverWhere });
			const total = handovers.reduce(
				(s, h) => s + parseFloat(h.amount || "0"),
				0,
			);
			result.push({ center, handover_count: handovers.length, total_usd: total });
		}

		return { centers: result };
	}

	async getCashAudit(filters: ReportDateFilters) {
		const where: Record<string, unknown> = {};
		if (filters.from_date && filters.to_date) {
			where.handoverDate = Between(
				new Date(filters.from_date),
				new Date(filters.to_date),
			);
		}
		if (filters.center_id) {
			where.toType = "center";
			where.toId = filters.center_id;
		}

		const handovers = await this.handovers.find({
			where,
			relations: { handedBy: true, receivedBy: true },
			order: { handoverDate: "DESC" },
		});

		const confirmed = handovers.filter(
			(h) => h.status === CashHandoverStatus.CONFIRMED,
		);
		const pending = handovers.filter(
			(h) => h.status === CashHandoverStatus.PENDING,
		);
		const rejected = handovers.filter(
			(h) => h.status === CashHandoverStatus.REJECTED,
		);

		return {
			handovers,
			stats: {
				total_count: handovers.length,
				confirmed_count: confirmed.length,
				pending_count: pending.length,
				rejected_count: rejected.length,
				total_confirmed_usd: confirmed.reduce(
					(s, h) => s + parseFloat(h.amount || "0"),
					0,
				),
				total_pending_usd: pending.reduce(
					(s, h) => s + parseFloat(h.amount || "0"),
					0,
				),
			},
		};
	}
}
