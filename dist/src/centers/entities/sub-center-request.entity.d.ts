import { User } from "src/users/entities/user.entity";
import { Center } from "src/centers/entities/center.entity";
import { SubCenterRequestStatus } from "src/centers/enums/sub-center-request-status.enum";
export declare class SubCenterRequest {
    id: number;
    requestedName: string;
    location?: string | null;
    notes?: string | null;
    requestedByUserId: string;
    requestedByUser?: User;
    requestedFromCenterId?: number | null;
    requestedFromCenter?: Center | null;
    status: SubCenterRequestStatus;
    createdAt: Date;
}
