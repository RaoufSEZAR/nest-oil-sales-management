import { Customer } from "src/erp/entities/customer.entity";
import { User } from "src/users/entities/user.entity";
import { Invoice } from "src/erp/entities/invoice.entity";
import { ReturnItem } from "src/erp/entities/return-item.entity";
import { SalesReturnType } from "src/erp/enums/sales-return-type.enum";
import { SalesReturnStatus } from "src/erp/enums/sales-return-status.enum";
export declare class SalesReturn {
    id: number;
    returnNumber: string;
    returnType: SalesReturnType;
    originalInvoice?: Invoice | null;
    customer: Customer;
    salesRep: User;
    date: string;
    totalAmount: string;
    reason?: string | null;
    status: SalesReturnStatus;
    notes?: string | null;
    synced: boolean;
    items: ReturnItem[];
    createdAt: Date;
    updatedAt: Date;
}
