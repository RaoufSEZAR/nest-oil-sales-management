import { Repository } from "typeorm";
import { Invoice } from "src/erp/entities/invoice.entity";
import { Customer } from "src/erp/entities/customer.entity";
import { Payment } from "src/erp/entities/payment.entity";
import { VehicleTrip } from "src/erp/entities/vehicle-trip.entity";
import { CashHandover } from "src/erp/entities/cash-handover.entity";
import { Product, Inventory } from "src/products/entities/product.entity";
import { Center } from "src/centers/entities/center.entity";
import { Vehicle } from "src/vehicles/entities/vehicle.entity";
export interface ReportDateFilters {
    from_date?: string;
    to_date?: string;
    sales_rep_id?: string;
    customer_id?: number;
    center_id?: number;
    status?: string;
}
export declare class ReportsService {
    private readonly invoices;
    private readonly customers;
    private readonly payments;
    private readonly trips;
    private readonly handovers;
    private readonly products;
    private readonly inventory;
    private readonly centers;
    private readonly vehicles;
    constructor(invoices: Repository<Invoice>, customers: Repository<Customer>, payments: Repository<Payment>, trips: Repository<VehicleTrip>, handovers: Repository<CashHandover>, products: Repository<Product>, inventory: Repository<Inventory>, centers: Repository<Center>, vehicles: Repository<Vehicle>);
    getSalesReport(filters: ReportDateFilters): Promise<{
        invoices: Invoice[];
        stats: {
            total_invoices: number;
            total_sales: number;
            total_paid_usd: number;
            total_pending: number;
        };
    }>;
    getVehicleReport(vehicleId: number, filters: ReportDateFilters): Promise<{
        vehicle: Vehicle;
        trips: VehicleTrip[];
        invoices: Invoice[];
    }>;
    getCenterReport(centerId: number, filters: ReportDateFilters): Promise<{
        center: Center;
        payments: Payment[];
    }>;
    getAdminReport(filters: ReportDateFilters): Promise<{
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
        warehouse: Product[];
        locations: Inventory[];
        stats: {
            product_count: number;
            location_rows: number;
            total_warehouse_qty: number;
        };
    }>;
    getCentersComparison(filters: ReportDateFilters): Promise<{
        centers: any[];
    }>;
    getCashAudit(filters: ReportDateFilters): Promise<{
        handovers: CashHandover[];
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
