import { ErpPaymentsService } from "src/erp/payments.service";
import { CreatePaymentDto } from "src/erp/dto/documents.dto";
export declare class ErpPaymentsController {
    private readonly payments;
    constructor(payments: ErpPaymentsService);
    findByCustomer(customerId: number): Promise<import("./entities/payment.entity").Payment[]>;
    findAll(customer_id?: string, received_by?: string, from_date?: string, to_date?: string): Promise<import("./entities/payment.entity").Payment[]>;
    findOne(id: number): Promise<import("./entities/payment.entity").Payment>;
    create(dto: CreatePaymentDto): Promise<import("./entities/payment.entity").Payment>;
    update(id: number, dto: CreatePaymentDto): Promise<import("./entities/payment.entity").Payment>;
    remove(id: number): Promise<void>;
}
