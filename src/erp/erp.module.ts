import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Sequence } from "src/erp/entities/sequence.entity";
import { Customer } from "src/erp/entities/customer.entity";
import { Invoice } from "src/erp/entities/invoice.entity";
import { InvoiceItem } from "src/erp/entities/invoice-item.entity";
import { SalesReturn } from "src/erp/entities/sales-return.entity";
import { ReturnItem } from "src/erp/entities/return-item.entity";
import { Payment } from "src/erp/entities/payment.entity";
import { VehicleTrip } from "src/erp/entities/vehicle-trip.entity";
import { Expense } from "src/erp/entities/expense.entity";
import { ExpenseCategory } from "src/erp/entities/expense-category.entity";
import { Purchase } from "src/erp/entities/purchase.entity";
import { PurchaseItem } from "src/erp/entities/purchase-item.entity";
import { PurchaseDistribution } from "src/erp/entities/purchase-distribution.entity";
import { CurrencyExchange } from "src/erp/entities/currency-exchange.entity";
import { InventoryTransfer } from "src/erp/entities/inventory-transfer.entity";
import { TransferItem } from "src/erp/entities/transfer-item.entity";
import { CashHandover } from "src/erp/entities/cash-handover.entity";
import { Center } from "src/centers/entities/center.entity";
import { Vehicle } from "src/vehicles/entities/vehicle.entity";
import { Product, Inventory } from "src/products/entities/product.entity";
import { SequenceService } from "src/erp/sequence.service";
import { ErpCustomersService } from "src/erp/customers.service";
import { ErpCustomersController } from "src/erp/customers.controller";
import { ErpInvoicesService } from "src/erp/invoices.service";
import { ErpInvoicesController } from "src/erp/invoices.controller";
import { ErpReturnsService } from "src/erp/returns.service";
import { ErpReturnsController } from "src/erp/returns.controller";
import { ErpPaymentsService } from "src/erp/payments.service";
import { ErpPaymentsController } from "src/erp/payments.controller";
import { ErpVehicleTripsService } from "src/erp/vehicle-trips.service";
import { ErpVehicleTripsController } from "src/erp/vehicle-trips.controller";
import { ErpExpensesService } from "src/erp/expenses.service";
import { ErpExpensesController } from "src/erp/expenses.controller";
import { ErpExpenseCategoriesService } from "src/erp/expense-categories.service";
import { ErpExpenseCategoriesController } from "src/erp/expense-categories.controller";
import { ErpPurchasesService } from "src/erp/purchases.service";
import { ErpPurchasesController } from "src/erp/purchases.controller";
import { ErpCurrencyExchangesService } from "src/erp/currency-exchanges.service";
import { ErpCurrencyExchangesController } from "src/erp/currency-exchanges.controller";
import { ErpInventoryTransfersService } from "src/erp/inventory-transfers.service";
import { ErpInventoryTransfersController } from "src/erp/inventory-transfers.controller";
import { ErpCashHandoversService } from "src/erp/cash-handovers.service";
import { ErpCashHandoversController } from "src/erp/cash-handovers.controller";
import { ReportsService } from "src/erp/reports/reports.service";
import { ReportsController } from "src/erp/reports/reports.controller";
import { CashFlowService } from "src/erp/cash-flow/cash-flow.service";
import { CashFlowController } from "src/erp/cash-flow/cash-flow.controller";
import { TripsLegacyController } from "src/erp/legacy/trips-legacy.controller";
import { TransfersLegacyController } from "src/erp/legacy/transfers-legacy.controller";
import { ExchangesLegacyController } from "src/erp/legacy/exchanges-legacy.controller";
import { CashLegacyController } from "src/erp/legacy/cash-legacy.controller";
import { ProductsModule } from "src/products/products.module";

const erpEntities = [
	Sequence,
	Customer,
	Invoice,
	InvoiceItem,
	SalesReturn,
	ReturnItem,
	Payment,
	VehicleTrip,
	Expense,
	ExpenseCategory,
	Purchase,
	PurchaseItem,
	PurchaseDistribution,
	CurrencyExchange,
	InventoryTransfer,
	TransferItem,
	CashHandover,
	Center,
	Vehicle,
	Product,
	Inventory,
];

@Module({
	imports: [TypeOrmModule.forFeature(erpEntities), ProductsModule],
	controllers: [
		ErpCustomersController,
		ErpInvoicesController,
		ErpReturnsController,
		ErpPaymentsController,
		ErpVehicleTripsController,
		ErpExpensesController,
		ErpExpenseCategoriesController,
		ErpPurchasesController,
		ErpCurrencyExchangesController,
		ErpInventoryTransfersController,
		ErpCashHandoversController,
		ReportsController,
		CashFlowController,
		TripsLegacyController,
		TransfersLegacyController,
		ExchangesLegacyController,
		CashLegacyController,
	],
	providers: [
		SequenceService,
		ErpCustomersService,
		ErpInvoicesService,
		ErpReturnsService,
		ErpPaymentsService,
		ErpVehicleTripsService,
		ErpExpensesService,
		ErpExpenseCategoriesService,
		ErpPurchasesService,
		ErpCurrencyExchangesService,
		ErpInventoryTransfersService,
		ErpCashHandoversService,
		ReportsService,
		CashFlowService,
	],
	exports: [TypeOrmModule, SequenceService],
})
export class ErpModule {}
