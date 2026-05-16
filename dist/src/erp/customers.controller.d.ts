import { ErpCustomersService } from "src/erp/customers.service";
import { CreateCustomerDto, UpdateCustomerDto } from "src/erp/dto/customer.dto";
export declare class ErpCustomersController {
    private readonly customers;
    constructor(customers: ErpCustomersService);
    findAll(search?: string, sales_rep_id?: string, area?: string): Promise<import("./entities/customer.entity").Customer[]>;
    getBalance(id: number): Promise<{
        customer_id: number;
        balance: number;
        deferred_payment: number;
    }>;
    findOne(id: number): Promise<import("./entities/customer.entity").Customer>;
    create(dto: CreateCustomerDto): Promise<import("./entities/customer.entity").Customer>;
    update(id: number, dto: UpdateCustomerDto): Promise<import("./entities/customer.entity").Customer>;
    updatePut(id: number, dto: UpdateCustomerDto): Promise<import("./entities/customer.entity").Customer>;
    remove(id: number): Promise<void>;
}
