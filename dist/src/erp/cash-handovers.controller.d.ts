import { CashHandoverStatus } from "src/erp/enums/cash-handover-status.enum";
import { ErpCashHandoversService } from "src/erp/cash-handovers.service";
import { CreateCashHandoverDto, UpdateCashHandoverDto } from "src/erp/dto/documents.dto";
export declare class ErpCashHandoversController {
    private readonly handovers;
    constructor(handovers: ErpCashHandoversService);
    findAll(from_type?: string, from_id?: string, to_type?: string, to_id?: string, status?: CashHandoverStatus): Promise<import("./entities/cash-handover.entity").CashHandover[]>;
    findOne(id: number): Promise<import("./entities/cash-handover.entity").CashHandover>;
    create(dto: CreateCashHandoverDto): Promise<import("./entities/cash-handover.entity").CashHandover>;
    update(id: number, dto: UpdateCashHandoverDto): Promise<import("./entities/cash-handover.entity").CashHandover>;
    confirm(id: number, req: {
        user: {
            userId: string;
        };
    }): Promise<import("./entities/cash-handover.entity").CashHandover>;
    reject(id: number, body: {
        notes?: string;
    }): Promise<import("./entities/cash-handover.entity").CashHandover>;
}
