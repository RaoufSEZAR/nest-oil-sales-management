import { Center } from "src/centers/entities/center.entity";
import { User } from "src/users/entities/user.entity";
import { TradeCurrency } from "src/erp/enums/trade-currency.enum";
export declare class Expense {
    id: number;
    expenseNumber: string;
    center?: Center | null;
    category: string;
    description?: string | null;
    amount: string;
    currency: TradeCurrency;
    exchangeRate: string;
    amountUsd: string;
    date: string;
    paidBy: User;
    notes?: string | null;
    createdAt: Date;
    updatedAt: Date;
}
