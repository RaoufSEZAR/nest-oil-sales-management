"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const invoice_entity_1 = require("../entities/invoice.entity");
const customer_entity_1 = require("../entities/customer.entity");
const payment_entity_1 = require("../entities/payment.entity");
const vehicle_trip_entity_1 = require("../entities/vehicle-trip.entity");
const cash_handover_entity_1 = require("../entities/cash-handover.entity");
const product_entity_1 = require("../../products/entities/product.entity");
const center_entity_1 = require("../../centers/entities/center.entity");
const vehicle_entity_1 = require("../../vehicles/entities/vehicle.entity");
const cash_handover_status_enum_1 = require("../enums/cash-handover-status.enum");
const query_filters_1 = require("../../common/utils/query-filters");
let ReportsService = class ReportsService {
    constructor(invoices, customers, payments, trips, handovers, products, inventory, centers, vehicles) {
        this.invoices = invoices;
        this.customers = customers;
        this.payments = payments;
        this.trips = trips;
        this.handovers = handovers;
        this.products = products;
        this.inventory = inventory;
        this.centers = centers;
        this.vehicles = vehicles;
    }
    async getSalesReport(filters) {
        const where = {};
        const dateFilter = (0, query_filters_1.dateRangeWhere)(filters.from_date, filters.to_date);
        if (dateFilter)
            where.date = dateFilter;
        if (filters.sales_rep_id)
            where.salesRep = { id: filters.sales_rep_id };
        if (filters.customer_id)
            where.customer = { id: filters.customer_id };
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
    async getVehicleReport(vehicleId, filters) {
        const vehicle = await this.vehicles.findOne({
            where: { id: vehicleId },
            relations: { center: true },
        });
        if (!vehicle)
            throw new common_1.NotFoundException("Vehicle not found");
        const tripWhere = { vehicle: { id: vehicleId } };
        const dateFilter = (0, query_filters_1.dateRangeWhere)(filters.from_date, filters.to_date);
        if (dateFilter)
            tripWhere.tripDate = dateFilter;
        const trips = await this.trips.find({
            where: tripWhere,
            relations: { salesRep: true },
            order: { tripDate: "DESC" },
            take: 20,
        });
        const invWhere = {};
        if (dateFilter)
            invWhere.date = dateFilter;
        const invoices = await this.invoices.find({
            where: invWhere,
            relations: { customer: true, salesRep: true },
        });
        const vehicleInvoices = invoices.filter((inv) => inv.trip?.vehicle?.id === vehicleId);
        return { vehicle, trips, invoices: vehicleInvoices };
    }
    async getCenterReport(centerId, filters) {
        const center = await this.centers.findOne({ where: { id: centerId } });
        if (!center)
            throw new common_1.NotFoundException("Center not found");
        const payments = await this.payments.find({
            where: {
                paymentDate: filters.from_date && filters.to_date
                    ? (0, typeorm_2.Between)(new Date(filters.from_date), new Date(filters.to_date))
                    : undefined,
            },
            relations: { customer: true, receivedBy: true },
            order: { paymentDate: "DESC" },
            take: 100,
        });
        return { center, payments };
    }
    async getAdminReport(filters) {
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
        const totalWarehouse = products.reduce((s, p) => s + parseFloat(p.stock || "0"), 0);
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
    async getCentersComparison(filters) {
        const centers = await this.centers.find({ where: { active: true } });
        const result = [];
        for (const center of centers) {
            const handoverWhere = {
                toType: "center",
                toId: center.id,
            };
            if (filters?.from_date && filters?.to_date) {
                handoverWhere.handoverDate = (0, typeorm_2.Between)(new Date(filters.from_date), new Date(filters.to_date));
            }
            const handovers = await this.handovers.find({ where: handoverWhere });
            const total = handovers.reduce((s, h) => s + parseFloat(h.amount || "0"), 0);
            result.push({ center, handover_count: handovers.length, total_usd: total });
        }
        return { centers: result };
    }
    async getCashAudit(filters) {
        const where = {};
        if (filters.from_date && filters.to_date) {
            where.handoverDate = (0, typeorm_2.Between)(new Date(filters.from_date), new Date(filters.to_date));
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
        const confirmed = handovers.filter((h) => h.status === cash_handover_status_enum_1.CashHandoverStatus.CONFIRMED);
        const pending = handovers.filter((h) => h.status === cash_handover_status_enum_1.CashHandoverStatus.PENDING);
        const rejected = handovers.filter((h) => h.status === cash_handover_status_enum_1.CashHandoverStatus.REJECTED);
        return {
            handovers,
            stats: {
                total_count: handovers.length,
                confirmed_count: confirmed.length,
                pending_count: pending.length,
                rejected_count: rejected.length,
                total_confirmed_usd: confirmed.reduce((s, h) => s + parseFloat(h.amount || "0"), 0),
                total_pending_usd: pending.reduce((s, h) => s + parseFloat(h.amount || "0"), 0),
            },
        };
    }
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(invoice_entity_1.Invoice)),
    __param(1, (0, typeorm_1.InjectRepository)(customer_entity_1.Customer)),
    __param(2, (0, typeorm_1.InjectRepository)(payment_entity_1.Payment)),
    __param(3, (0, typeorm_1.InjectRepository)(vehicle_trip_entity_1.VehicleTrip)),
    __param(4, (0, typeorm_1.InjectRepository)(cash_handover_entity_1.CashHandover)),
    __param(5, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __param(6, (0, typeorm_1.InjectRepository)(product_entity_1.Inventory)),
    __param(7, (0, typeorm_1.InjectRepository)(center_entity_1.Center)),
    __param(8, (0, typeorm_1.InjectRepository)(vehicle_entity_1.Vehicle)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ReportsService);
//# sourceMappingURL=reports.service.js.map