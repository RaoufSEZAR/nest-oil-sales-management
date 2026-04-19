import { Repository } from "typeorm";
import { Customer } from "src/erp/entities/customer.entity";
import { CreateCustomerDto, UpdateCustomerDto } from "src/erp/dto/customer.dto";
export declare class ErpCustomersService {
    private readonly repo;
    constructor(repo: Repository<Customer>);
    findAll(): Promise<Customer[]>;
    findOne(id: number): Promise<Customer>;
    create(dto: CreateCustomerDto): Promise<Customer>;
    update(id: number, dto: UpdateCustomerDto): Promise<Customer>;
}
