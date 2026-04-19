import { ErpCashHandoversService } from "src/erp/cash-handovers.service";
import { CreateCashHandoverDto, UpdateCashHandoverDto } from "src/erp/dto/documents.dto";
export declare class ErpCashHandoversController {
    private readonly handovers;
    constructor(handovers: ErpCashHandoversService);
    findAll(): Promise<import("./entities/cash-handover.entity").CashHandover[]>;
    findOne(id: number): Promise<import("./entities/cash-handover.entity").CashHandover>;
    create(dto: CreateCashHandoverDto): Promise<import("./entities/cash-handover.entity").CashHandover>;
    update(id: number, dto: UpdateCashHandoverDto): Promise<import("./entities/cash-handover.entity").CashHandover>;
}
