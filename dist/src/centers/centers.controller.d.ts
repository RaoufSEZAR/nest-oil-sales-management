import { CentersService } from "src/centers/centers.service";
import { CreateCenterDto } from "src/centers/dto/create-center.dto";
import { UpdateCenterDto } from "src/centers/dto/update-center.dto";
import { CenterType } from "src/centers/enums/center-type.enum";
export declare class CentersController {
    private readonly centersService;
    constructor(centersService: CentersService);
    findAll(centerType?: CenterType, activeRaw?: string): Promise<import("./entities/center.entity").Center[]>;
    findOne(id: number): Promise<import("./entities/center.entity").Center>;
    create(dto: CreateCenterDto): Promise<import("./entities/center.entity").Center>;
    update(id: number, dto: UpdateCenterDto): Promise<import("./entities/center.entity").Center>;
}
