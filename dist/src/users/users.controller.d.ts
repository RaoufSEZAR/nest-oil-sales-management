import { UsersService } from "src/users/users.service";
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
    constructor(usersService: UsersService);
    create(createUserDto: CreateUserDto): Promise<User>;
    getMe(req: {
        user: {
            userId: string;
        };
    }): Promise<User>;
    findByCenter(centerId: number): Promise<User[]>;
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
