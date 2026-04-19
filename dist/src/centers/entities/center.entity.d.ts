import { User } from "src/users/entities/user.entity";
import { Vehicle } from "src/vehicles/entities/vehicle.entity";
import { CenterType } from "src/centers/enums/center-type.enum";
export declare class Center {
    id: number;
    name: string;
    code: string;
    centerType: CenterType;
    isIndependent: boolean;
    address?: string | null;
    managerId?: string | null;
    manager?: User | null;
    parentCenterId?: number | null;
    parentCenter?: Center | null;
    branches: Center[];
    vehicles: Vehicle[];
    users: User[];
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
}
