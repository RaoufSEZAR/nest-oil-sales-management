import { ErpPaymentsService } from "src/erp/payments.service";
import { CreatePaymentDto } from "src/erp/dto/documents.dto";
export declare class ErpPaymentsController {
    private readonly payments;
    constructor(payments: ErpPaymentsService);
    findAll(): Promise<import("./entities/payment.entity").Payment[]>;
    findOne(id: number): Promise<import("./entities/payment.entity").Payment>;
    create(dto: CreatePaymentDto): Promise<import("./entities/payment.entity").Payment>;
}
