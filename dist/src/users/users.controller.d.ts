import { UsersService } from "src/users/users.service";
import { HrService } from "src/users/hr.service";
import { UpdateHrSettingsDto } from "src/users/dto/update-hr-settings.dto";
import { CreateUserDto } from "src/users/dto/create-user.dto";
import { UpdateUserDto } from "src/users/dto/update-user.dto";
import { AssignCenterDto } from "src/users/dto/assign-center.dto";
import { AssignVehicleDto } from "src/users/dto/assign-vehicle.dto";
import { UnassignDto } from "src/users/dto/unassign.dto";
import { ResetPasswordDto } from "src/users/dto/reset-password.dto";
import { User } from "src/users/entities/user.entity";
import { UserRole } from "src/users/enums/user-role.enum";
export declare class UsersController {
    private readonly usersService;
    private readonly hrService;
    constructor(usersService: UsersService, hrService: HrService);
    create(createUserDto: CreateUserDto): Promise<User>;
    getMe(req: {
        user: {
            userId: string;
        };
    }): Promise<User>;
    findByCenter(centerId: number): Promise<User[]>;
    getHrSettings(): Promise<User[]>;
    getMonthlyPayroll(month: string): Promise<{
        month: string;
        from_date: string;
        to_date: string;
        payroll: {
            id: string;
            name: string;
            role: UserRole;
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
        paid_salaries: import("../erp/entities/expense.entity").Expense[];
    }>;
    findAll(page?: number, limit?: number, role?: UserRole, centerIdRaw?: string, activeRaw?: string): Promise<{
        data: User[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: string): Promise<User>;
    assignToCenter(id: string, dto: AssignCenterDto): Promise<User>;
    assignToVehicle(id: string, dto: AssignVehicleDto): Promise<User>;
    unassign(id: string, dto: UnassignDto): Promise<User>;
    updateHrSettings(id: string, dto: UpdateHrSettingsDto): Promise<{
        id: string;
        firstName: string;
        lastName: string;
        baseSalary: string;
        commissionRate: string;
        commissionBasis: string;
    }>;
    toggleActive(id: string): Promise<User>;
    resetPassword(id: string, dto: ResetPasswordDto): Promise<{
        message: string;
    }>;
    deactivate(id: string): Promise<User>;
    activate(id: string): Promise<User>;
    update(id: string, updateUserDto: UpdateUserDto, req: {
        user: {
            role: UserRole;
        };
    }): Promise<User>;
    remove(id: string): Promise<void>;
}
