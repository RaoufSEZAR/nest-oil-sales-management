import { Repository } from "typeorm";
import { Payment } from "src/erp/entities/payment.entity";
import { CashHandover } from "src/erp/entities/cash-handover.entity";
import { Invoice } from "src/erp/entities/invoice.entity";
export declare class CashFlowService {
    private readonly payments;
    private readonly handovers;
    private readonly invoices;
    constructor(payments: Repository<Payment>, handovers: Repository<CashHandover>, invoices: Repository<Invoice>);
    private buildLedger;
    getMyCashFlow(userId: string): Promise<{
        user_id: string;
        breakdown: Record<string, unknown>;
        totals: {
            received_usd: number;
            handed_usd: number;
            balance_usd: number;
        };
    }>;
    validateHandover(userId: string, body: {
        currency?: string;
        amount?: number;
    }): Promise<{
        valid: boolean;
        currency: string;
        requested_usd: number;
        available_usd: number;
        message: string;
    }>;
}
