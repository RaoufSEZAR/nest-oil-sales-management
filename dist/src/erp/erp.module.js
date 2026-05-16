"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErpModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const sequence_entity_1 = require("./entities/sequence.entity");
const customer_entity_1 = require("./entities/customer.entity");
const invoice_entity_1 = require("./entities/invoice.entity");
const invoice_item_entity_1 = require("./entities/invoice-item.entity");
const sales_return_entity_1 = require("./entities/sales-return.entity");
const return_item_entity_1 = require("./entities/return-item.entity");
const payment_entity_1 = require("./entities/payment.entity");
const vehicle_trip_entity_1 = require("./entities/vehicle-trip.entity");
const expense_entity_1 = require("./entities/expense.entity");
const expense_category_entity_1 = require("./entities/expense-category.entity");
const purchase_entity_1 = require("./entities/purchase.entity");
const purchase_item_entity_1 = require("./entities/purchase-item.entity");
const purchase_distribution_entity_1 = require("./entities/purchase-distribution.entity");
const currency_exchange_entity_1 = require("./entities/currency-exchange.entity");
const inventory_transfer_entity_1 = require("./entities/inventory-transfer.entity");
const transfer_item_entity_1 = require("./entities/transfer-item.entity");
const cash_handover_entity_1 = require("./entities/cash-handover.entity");
const center_entity_1 = require("../centers/entities/center.entity");
const vehicle_entity_1 = require("../vehicles/entities/vehicle.entity");
const product_entity_1 = require("../products/entities/product.entity");
const sequence_service_1 = require("./sequence.service");
const customers_service_1 = require("./customers.service");
const customers_controller_1 = require("./customers.controller");
const invoices_service_1 = require("./invoices.service");
const invoices_controller_1 = require("./invoices.controller");
const returns_service_1 = require("./returns.service");
const returns_controller_1 = require("./returns.controller");
const payments_service_1 = require("./payments.service");
const payments_controller_1 = require("./payments.controller");
const vehicle_trips_service_1 = require("./vehicle-trips.service");
const vehicle_trips_controller_1 = require("./vehicle-trips.controller");
const expenses_service_1 = require("./expenses.service");
const expenses_controller_1 = require("./expenses.controller");
const expense_categories_service_1 = require("./expense-categories.service");
const expense_categories_controller_1 = require("./expense-categories.controller");
const purchases_service_1 = require("./purchases.service");
const purchases_controller_1 = require("./purchases.controller");
const currency_exchanges_service_1 = require("./currency-exchanges.service");
const currency_exchanges_controller_1 = require("./currency-exchanges.controller");
const inventory_transfers_service_1 = require("./inventory-transfers.service");
const inventory_transfers_controller_1 = require("./inventory-transfers.controller");
const cash_handovers_service_1 = require("./cash-handovers.service");
const cash_handovers_controller_1 = require("./cash-handovers.controller");
const reports_service_1 = require("./reports/reports.service");
const reports_controller_1 = require("./reports/reports.controller");
const cash_flow_service_1 = require("./cash-flow/cash-flow.service");
const cash_flow_controller_1 = require("./cash-flow/cash-flow.controller");
const trips_legacy_controller_1 = require("./legacy/trips-legacy.controller");
const transfers_legacy_controller_1 = require("./legacy/transfers-legacy.controller");
const exchanges_legacy_controller_1 = require("./legacy/exchanges-legacy.controller");
const cash_legacy_controller_1 = require("./legacy/cash-legacy.controller");
const products_module_1 = require("../products/products.module");
const erpEntities = [
    sequence_entity_1.Sequence,
    customer_entity_1.Customer,
    invoice_entity_1.Invoice,
    invoice_item_entity_1.InvoiceItem,
    sales_return_entity_1.SalesReturn,
    return_item_entity_1.ReturnItem,
    payment_entity_1.Payment,
    vehicle_trip_entity_1.VehicleTrip,
    expense_entity_1.Expense,
    expense_category_entity_1.ExpenseCategory,
    purchase_entity_1.Purchase,
    purchase_item_entity_1.PurchaseItem,
    purchase_distribution_entity_1.PurchaseDistribution,
    currency_exchange_entity_1.CurrencyExchange,
    inventory_transfer_entity_1.InventoryTransfer,
    transfer_item_entity_1.TransferItem,
    cash_handover_entity_1.CashHandover,
    center_entity_1.Center,
    vehicle_entity_1.Vehicle,
    product_entity_1.Product,
    product_entity_1.Inventory,
];
let ErpModule = class ErpModule {
};
exports.ErpModule = ErpModule;
exports.ErpModule = ErpModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature(erpEntities), products_module_1.ProductsModule],
        controllers: [
            customers_controller_1.ErpCustomersController,
            invoices_controller_1.ErpInvoicesController,
            returns_controller_1.ErpReturnsController,
            payments_controller_1.ErpPaymentsController,
            vehicle_trips_controller_1.ErpVehicleTripsController,
            expenses_controller_1.ErpExpensesController,
            expense_categories_controller_1.ErpExpenseCategoriesController,
            purchases_controller_1.ErpPurchasesController,
            currency_exchanges_controller_1.ErpCurrencyExchangesController,
            inventory_transfers_controller_1.ErpInventoryTransfersController,
            cash_handovers_controller_1.ErpCashHandoversController,
            reports_controller_1.ReportsController,
            cash_flow_controller_1.CashFlowController,
            trips_legacy_controller_1.TripsLegacyController,
            transfers_legacy_controller_1.TransfersLegacyController,
            exchanges_legacy_controller_1.ExchangesLegacyController,
            cash_legacy_controller_1.CashLegacyController,
        ],
        providers: [
            sequence_service_1.SequenceService,
            customers_service_1.ErpCustomersService,
            invoices_service_1.ErpInvoicesService,
            returns_service_1.ErpReturnsService,
            payments_service_1.ErpPaymentsService,
            vehicle_trips_service_1.ErpVehicleTripsService,
            expenses_service_1.ErpExpensesService,
            expense_categories_service_1.ErpExpenseCategoriesService,
            purchases_service_1.ErpPurchasesService,
            currency_exchanges_service_1.ErpCurrencyExchangesService,
            inventory_transfers_service_1.ErpInventoryTransfersService,
            cash_handovers_service_1.ErpCashHandoversService,
            reports_service_1.ReportsService,
            cash_flow_service_1.CashFlowService,
        ],
        exports: [typeorm_1.TypeOrmModule, sequence_service_1.SequenceService],
    })
], ErpModule);
//# sourceMappingURL=erp.module.js.map