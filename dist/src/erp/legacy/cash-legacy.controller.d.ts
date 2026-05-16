import { ErpCashHandoversService } from "src/erp/cash-handovers.service";
import { CreateCashHandoverDto, UpdateCashHandoverDto } from "src/erp/dto/documents.dto";
import { CashHandoverStatus } from "src/erp/enums/cash-handover-status.enum";
export declare class CashLegacyController {
    private readonly handovers;
    constructor(handovers: ErpCashHandoversService);
    getVehicleHandovers(vehicleId: number, status?: CashHandoverStatus): Promise<import("../entities/cash-handover.entity").CashHandover[]>;
    getCenterHandovers(centerId: number, status?: CashHandoverStatus): Promise<import("../entities/cash-handover.entity").CashHandover[]>;
    findAll(from_type?: string, from_id?: string, status?: CashHandoverStatus): Promise<import("../entities/cash-handover.entity").CashHandover[]>;
    findOne(id: number): Promise<import("../entities/cash-handover.entity").CashHandover>;
    create(req: {
        user: {
            userId: string;
        };
    }, dto: CreateCashHandoverDto): Promise<import("../entities/cash-handover.entity").CashHandover>;
    confirm(id: number, req: {
        user: {
            userId: string;
        };
    }): Promise<import("../entities/cash-handover.entity").CashHandover>;
    reject(id: number, body: {
        notes?: string;
    }): Promise<import("../entities/cash-handover.entity").CashHandover>;
    update(id: number, dto: UpdateCashHandoverDto): Promise<import("../entities/cash-handover.entity").CashHandover>;
}
