import { User } from "src/users/entities/user.entity";
import { CashHandoverStatus } from "src/erp/enums/cash-handover-status.enum";
export declare class CashHandover {
    id: number;
    handoverNumber: string;
    fromType: string;
    fromId: number;
    toType: string;
    toId: number;
    amount: string;
    originalCurrency: string;
    originalAmount?: string | null;
    handoverDate: Date;
    handedBy: User;
    receivedBy?: User | null;
    notes?: string | null;
    status: CashHandoverStatus;
    confirmedAt?: Date | null;
    createdAt: Date;
    updatedAt: Date;
}
