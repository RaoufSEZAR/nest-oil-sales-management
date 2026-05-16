import { TradeCurrency } from "src/erp/enums/trade-currency.enum";
import { SalesReturnType } from "src/erp/enums/sales-return-type.enum";
import { ReturnItemCondition } from "src/erp/enums/return-item-condition.enum";
import { TripStatus } from "src/erp/enums/trip-status.enum";
import { TransferLocationType } from "src/erp/enums/transfer-location-type.enum";
import { TransferStatus } from "src/erp/enums/transfer-status.enum";
import { CashHandoverStatus } from "src/erp/enums/cash-handover-status.enum";
export declare class InvoiceLineDto {
    productId: number;
    quantity: number;
    unitPrice: number;
}
export declare class CreateInvoiceDto {
    customerId: number;
    salesRepId: string;
    date: string;
    items: InvoiceLineDto[];
    currency?: TradeCurrency;
    exchangeRate?: number;
    discount?: number;
    taxRate?: number;
    tripId?: number;
    notes?: string;
}
export declare class ReturnLineDto {
    productId: number;
    quantity: number;
    unitPrice: number;
    condition?: ReturnItemCondition;
    reasonDetail?: string;
}
export declare class CreateSalesReturnDto {
    returnType: SalesReturnType;
    customerId: number;
    salesRepId: string;
    date: string;
    items: ReturnLineDto[];
    originalInvoiceId?: number;
    reason?: string;
    notes?: string;
}
export declare class CreatePaymentDto {
    customerId: number;
    amount: number;
    currency?: TradeCurrency;
    exchangeRate?: number;
    paymentMethod?: string;
    paymentDate: string;
    receivedById: string;
    referenceNumber?: string;
    notes?: string;
    relatedInvoices?: Record<string, unknown>;
}
export declare class CreateVehicleTripDto {
    vehicleId: number;
    salesRepId: string;
    tripDate: string;
    odometerStart: number;
    odometerStartPhoto?: string;
    notes?: string;
}
export declare class UpdateVehicleTripDto {
    odometerEnd?: number;
    odometerEndPhoto?: string;
    fuelCompensation?: number;
    notes?: string;
    status?: TripStatus;
    endedAt?: string;
}
export declare class CreateExpenseDto {
    centerId?: number;
    category: string;
    description?: string;
    amount: number;
    currency?: TradeCurrency;
    exchangeRate?: number;
    date: string;
    paidById: string;
    notes?: string;
}
export declare class PurchaseLineDto {
    productId?: number;
    description?: string;
    quantity: number;
    unitPriceUsd: number;
}
export declare class CreatePurchaseDto {
    centerId?: number;
    supplierName: string;
    supplierPhone?: string;
    date: string;
    currency?: TradeCurrency;
    exchangeRate?: number;
    createdById: string;
    items: PurchaseLineDto[];
    customsCost?: number;
    shippingCost?: number;
    notes?: string;
}
export declare class CreateCurrencyExchangeDto {
    centerId: number;
    fromCurrency: TradeCurrency;
    fromAmount: number;
    fromAmountUsd: number;
    toCurrency: TradeCurrency;
    toAmount: number;
    toAmountUsd: number;
    exchangeRate: number;
    fromWeightedRate?: number;
    toWeightedRate?: number;
    differenceUsd?: number;
    notes?: string;
    createdById: string;
}
export declare class TransferLineDto {
    productId: number;
    quantity: number;
}
export declare class CreateInventoryTransferDto {
    fromLocationType: TransferLocationType;
    fromLocationId: number;
    toLocationType: TransferLocationType;
    toLocationId: number;
    date: string;
    transferredById?: string;
    receivedById?: string;
    status?: TransferStatus;
    notes?: string;
    items: TransferLineDto[];
}
export declare class UpdateInventoryTransferDto {
    status?: TransferStatus;
    receivedById?: string;
    completedAt?: string;
    notes?: string;
}
export declare class CreateCashHandoverDto {
    fromType: string;
    fromId: number;
    toType: string;
    toId: number;
    amount: number;
    originalCurrency?: string;
    originalAmount?: number;
    handoverDate: string;
    handedById: string;
    notes?: string;
}
export declare class UpdateCashHandoverDto {
    status?: CashHandoverStatus;
    receivedById?: string;
    confirmedAt?: string;
    notes?: string;
}
export declare class CreatePurchaseDistributionDto {
    centerId: number;
    productId: number;
    quantity: number;
    distributedById?: string;
    notes?: string;
}
export declare class UpdatePurchaseDto {
    supplierName?: string;
    supplierPhone?: string;
    notes?: string;
}
