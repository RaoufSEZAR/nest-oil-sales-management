import { Repository } from "typeorm";
import { Customer } from "src/erp/entities/customer.entity";
import { CreateCustomerDto, UpdateCustomerDto } from "src/erp/dto/customer.dto";
export declare class ErpCustomersService {
    private readonly repo;
    constructor(repo: Repository<Customer>);
    findAll(filters?: {
        search?: string;
        sales_rep_id?: string;
        area?: string;
    }): Promise<Customer[]>;
    getBalance(id: number): Promise<{
        customer_id: number;
        balance: number;
        deferred_payment: number;
    }>;
    remove(id: number): Promise<void>;
    findOne(id: number): Promise<Customer>;
    create(dto: CreateCustomerDto): Promise<Customer>;
    update(id: number, dto: UpdateCustomerDto): Promise<Customer>;
}
