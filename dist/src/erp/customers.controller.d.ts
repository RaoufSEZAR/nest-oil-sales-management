import { ErpCustomersService } from "src/erp/customers.service";
import { CreateCustomerDto, UpdateCustomerDto } from "src/erp/dto/customer.dto";
export declare class ErpCustomersController {
    private readonly customers;
    constructor(customers: ErpCustomersService);
    findAll(): Promise<import("./entities/customer.entity").Customer[]>;
    findOne(id: number): Promise<import("./entities/customer.entity").Customer>;
    create(dto: CreateCustomerDto): Promise<import("./entities/customer.entity").Customer>;
    update(id: number, dto: UpdateCustomerDto): Promise<import("./entities/customer.entity").Customer>;
}
