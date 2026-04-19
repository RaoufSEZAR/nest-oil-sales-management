export declare class CreateCustomerDto {
    name: string;
    phone: string;
    address?: string;
    area?: string;
    salesRepId?: string;
    notes?: string;
}
declare const UpdateCustomerDto_base: import("@nestjs/common").Type<Partial<CreateCustomerDto>>;
export declare class UpdateCustomerDto extends UpdateCustomerDto_base {
}
export {};
