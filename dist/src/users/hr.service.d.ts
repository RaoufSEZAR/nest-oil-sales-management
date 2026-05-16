import { Repository } from "typeorm";
import { User } from "src/users/entities/user.entity";
import { UpdateHrSettingsDto } from "src/users/dto/update-hr-settings.dto";
import { Invoice } from "src/erp/entities/invoice.entity";
import { Payment } from "src/erp/entities/payment.entity";
import { Expense } from "src/erp/entities/expense.entity";
export declare class HrService {
    private readonly users;
    private readonly invoices;
    private readonly payments;
    private readonly expenses;
    constructor(users: Repository<User>, invoices: Repository<Invoice>, payments: Repository<Payment>, expenses: Repository<Expense>);
    getHrSettings(): Promise<User[]>;
    updateHrSettings(userId: string, dto: UpdateHrSettingsDto): Promise<{
        id: string;
        firstName: string;
        lastName: string;
        baseSalary: string;
        commissionRate: string;
        commissionBasis: string;
    }>;
    getMonthlyPayroll(month: string): Promise<{
        month: string;
        from_date: string;
        to_date: string;
        payroll: {
            id: string;
            name: string;
            role: import("./enums/user-role.enum").UserRole;
            center_id: number;
            base_salary: number;
            commission_rate: number;
            commission_basis: string;
            sales: number;
            cash_collected: number;
            commission: number;
            total_due: number;
            paid_this_month: number;
            remaining: number;
        }[];
        totals: {
            total_due: number;
            paid_this_month: number;
            remaining: number;
        };
        paid_salaries: Expense[];
    }>;
}
