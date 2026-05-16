import { CreateCenterDto } from "src/centers/dto/create-center.dto";
declare const UpdateCenterDto_base: import("@nestjs/common").Type<Partial<CreateCenterDto>>;
export declare class UpdateCenterDto extends UpdateCenterDto_base {
    active?: boolean;
}
export {};
