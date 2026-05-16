import { ReportsService } from "src/erp/reports/reports.service";
export declare class ReportsController {
    private readonly reports;
    constructor(reports: ReportsService);
    private filters;
    getSalesReport(from_date?: string, to_date?: string, sales_rep_id?: string, customer_id?: string): Promise<{
        invoices: import("../entities/invoice.entity").Invoice[];
        stats: {
            total_invoices: number;
            total_sales: number;
            total_paid_usd: number;
            total_pending: number;
        };
    }>;
    getVehicleReport(vehicleId: number, from_date?: string, to_date?: string): Promise<{
        vehicle: import("../../vehicles/entities/vehicle.entity").Vehicle;
        trips: import("../entities/vehicle-trip.entity").VehicleTrip[];
        invoices: import("../entities/invoice.entity").Invoice[];
    }>;
    getCenterReport(centerId: number, from_date?: string, to_date?: string): Promise<{
        center: import("../../centers/entities/center.entity").Center;
        payments: import("../entities/payment.entity").Payment[];
    }>;
    getAdminReport(from_date?: string, to_date?: string): Promise<{
        sales_stats: {
            total_invoices: number;
            total_sales: number;
            total_paid_usd: number;
            total_pending: number;
        };
        customer_count: number;
        active_products: number;
    }>;
    getInventoryReport(): Promise<{
        warehouse: import("../../products/entities/product.entity").Product[];
        locations: import("../../products/entities/product.entity").Inventory[];
        stats: {
            product_count: number;
            location_rows: number;
            total_warehouse_qty: number;
        };
    }>;
    getCentersComparison(from_date?: string, to_date?: string): Promise<{
        centers: any[];
    }>;
    getCashAudit(from_date?: string, to_date?: string, center_id?: string): Promise<{
        handovers: import("../entities/cash-handover.entity").CashHandover[];
        stats: {
            total_count: number;
            confirmed_count: number;
            pending_count: number;
            rejected_count: number;
            total_confirmed_usd: number;
            total_pending_usd: number;
        };
    }>;
}
