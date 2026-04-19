import { Repository } from "typeorm";
import { Center } from "src/centers/entities/center.entity";
import { CreateCenterDto } from "src/centers/dto/create-center.dto";
import { UpdateCenterDto } from "src/centers/dto/update-center.dto";
import { User } from "src/users/entities/user.entity";
import { CenterType } from "src/centers/enums/center-type.enum";
export declare class CentersService {
    private readonly centersRepo;
    private readonly usersRepo;
    constructor(centersRepo: Repository<Center>, usersRepo: Repository<User>);
    private stripPasswordsFromUsers;
    private stripManagerPassword;
    findAll(filters: {
        centerType?: CenterType;
        active?: boolean;
    }): Promise<Center[]>;
    findOne(id: number): Promise<Center>;
    create(dto: CreateCenterDto): Promise<Center>;
    update(id: number, dto: UpdateCenterDto): Promise<Center>;
}
