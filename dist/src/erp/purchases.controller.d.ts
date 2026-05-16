import { ErpPurchasesService } from "src/erp/purchases.service";
import { CreatePurchaseDto, CreatePurchaseDistributionDto, UpdatePurchaseDto } from "src/erp/dto/documents.dto";
export declare class ErpPurchasesController {
    private readonly purchases;
    constructor(purchases: ErpPurchasesService);
    findAll(): Promise<import("./entities/purchase.entity").Purchase[]>;
    findOne(id: number): Promise<import("./entities/purchase.entity").Purchase>;
    create(dto: CreatePurchaseDto): Promise<import("./entities/purchase.entity").Purchase>;
    update(id: number, dto: UpdatePurchaseDto): Promise<import("./entities/purchase.entity").Purchase>;
    addDistribution(id: number, dto: CreatePurchaseDistributionDto): Promise<import("./entities/purchase-distribution.entity").PurchaseDistribution>;
    confirmReceipt(id: number, req: {
        user: {
            userId: string;
        };
    }): Promise<import("./entities/purchase.entity").Purchase>;
    rejectReceipt(id: number, req: {
        user: {
            userId: string;
        };
    }, body: {
        notes?: string;
    }): Promise<import("./entities/purchase.entity").Purchase>;
    updatePayment(id: number, body: {
        paid_amount: number;
        currency?: string;
        exchange_rate?: number;
    }): Promise<import("./entities/purchase.entity").Purchase>;
}
