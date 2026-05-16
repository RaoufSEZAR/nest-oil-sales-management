import { CenterType } from "src/centers/enums/center-type.enum";
export declare class CreateCenterDto {
    name: string;
    code: string;
    centerType?: CenterType;
    isIndependent?: boolean;
    address?: string;
    managerId?: string;
    parentCenterId?: number;
}
