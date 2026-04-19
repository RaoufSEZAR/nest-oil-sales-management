import { Customer } from "src/erp/entities/customer.entity";
import { User } from "src/users/entities/user.entity";
import { TradeCurrency } from "src/erp/enums/trade-currency.enum";
export declare class Payment {
    id: number;
    paymentNumber: string;
    customer: Customer;
    amount: string;
    currency: TradeCurrency;
    exchangeRate: string;
    amountUsd?: string | null;
    paymentMethod: string;
    paymentDate: Date;
    receivedBy: User;
    referenceNumber?: string | null;
    notes?: string | null;
    relatedInvoices?: Record<string, unknown> | null;
    editedOnce: boolean;
    lastEditAllowedUntil?: Date | null;
    createdAt: Date;
    updatedAt: Date;
}
