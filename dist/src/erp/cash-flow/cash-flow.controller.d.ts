import { CashFlowService } from "src/erp/cash-flow/cash-flow.service";
export declare class CashFlowController {
    private readonly cashFlow;
    constructor(cashFlow: CashFlowService);
    getMyCashFlow(req: {
        user: {
            userId: string;
        };
    }): Promise<{
        user_id: string;
        breakdown: Record<string, unknown>;
        totals: {
            received_usd: number;
            handed_usd: number;
            balance_usd: number;
        };
    }>;
    validateHandover(req: {
        user: {
            userId: string;
        };
    }, body: {
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
