import { DataSource, Repository } from "typeorm";
import { User } from "src/users/entities/user.entity";
import { Vehicle } from "src/vehicles/entities/vehicle.entity";
import { Center } from "src/centers/entities/center.entity";
import { CreateUserDto } from "src/users/dto/create-user.dto";
import { UpdateUserDto } from "src/users/dto/update-user.dto";
import { UserRole } from "src/users/enums/user-role.enum";
export declare class UsersService {
    private usersRepository;
    private vehiclesRepository;
    private centersRepository;
    private dataSource;
    constructor(usersRepository: Repository<User>, vehiclesRepository: Repository<Vehicle>, centersRepository: Repository<Center>, dataSource: DataSource);
    create(createUserDto: CreateUserDto): Promise<User>;
    findAll(page?: number, limit?: number, filters?: {
        role?: UserRole;
        centerId?: number;
        active?: boolean;
    }): Promise<{
        data: User[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findByCenter(centerId: number): Promise<User[]>;
    findOne(id: string): Promise<User>;
    findOneWithRelations(id: string): Promise<User>;
    findOneWithPassword(id: string): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    findByPhoneNumber(phone: string): Promise<User | null>;
    update(id: string, updateUserDto: UpdateUserDto, options?: {
        allowStaffPasswordReset?: boolean;
    }): Promise<User>;
    resetPassword(id: string, password: string): Promise<{
        message: string;
    }>;
    remove(id: string): Promise<void>;
    deactivate(id: string): Promise<User>;
    activate(id: string): Promise<User>;
    toggleActive(id: string): Promise<User>;
    assignToCenter(userId: string, centerId: number): Promise<User>;
    assignToVehicle(userId: string, vehicleId: number): Promise<User>;
    unassign(userId: string, remove: "vehicle" | "center" | "all"): Promise<User>;
}
