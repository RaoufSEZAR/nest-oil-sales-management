import { User } from "src/users/entities/user.entity";
export declare class Customer {
    id: number;
    name: string;
    phone: string;
    address?: string | null;
    area?: string | null;
    balance: string;
    deferredPayment: string;
    salesRep?: User | null;
    notes?: string | null;
    editCount: number;
    lastEditedAt?: Date | null;
    createdAt: Date;
    updatedAt: Date;
}
