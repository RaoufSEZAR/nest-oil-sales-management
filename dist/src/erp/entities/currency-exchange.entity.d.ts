import { Center } from "src/centers/entities/center.entity";
import { User } from "src/users/entities/user.entity";
import { TradeCurrency } from "src/erp/enums/trade-currency.enum";
export declare class CurrencyExchange {
    id: number;
    exchangeNumber: string;
    center: Center;
    fromCurrency: TradeCurrency;
    fromAmount: string;
    fromAmountUsd: string;
    toCurrency: TradeCurrency;
    toAmount: string;
    toAmountUsd: string;
    exchangeRate: string;
    fromWeightedRate: string;
    toWeightedRate: string;
    differenceUsd: string;
    notes?: string | null;
    createdBy: User;
    createdAt: Date;
    updatedAt: Date;
}
