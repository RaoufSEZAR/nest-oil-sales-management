import { Repository } from "typeorm";
import { Center } from "src/centers/entities/center.entity";
import { SubCenterRequest } from "src/centers/entities/sub-center-request.entity";
import { CreateCenterDto } from "src/centers/dto/create-center.dto";
import { UpdateCenterDto } from "src/centers/dto/update-center.dto";
import { CreateSubCenterRequestDto } from "src/centers/dto/create-sub-center-request.dto";
import { User } from "src/users/entities/user.entity";
import { CenterType } from "src/centers/enums/center-type.enum";
export declare class CentersService {
    private readonly centersRepo;
    private readonly subCenterRequestsRepo;
    private readonly usersRepo;
    constructor(centersRepo: Repository<Center>, subCenterRequestsRepo: Repository<SubCenterRequest>, usersRepo: Repository<User>);
    private stripPasswordsFromUsers;
    private stripManagerPassword;
    findAll(filters: {
        centerType?: CenterType;
        active?: boolean;
    }): Promise<Center[]>;
    findOne(id: number): Promise<Center>;
    createSubCenterRequest(userId: string, dto: CreateSubCenterRequestDto): Promise<SubCenterRequest>;
    private allocateUniqueBranchCode;
    createQuickBranch(userId: string, dto: CreateSubCenterRequestDto): Promise<Center>;
    create(dto: CreateCenterDto): Promise<Center>;
    update(id: number, dto: UpdateCenterDto): Promise<Center>;
}
