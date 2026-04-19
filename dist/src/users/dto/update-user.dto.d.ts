import { CreateUserDto } from "src/users/dto/create-user.dto";
declare const UpdateUserDto_base: import("@nestjs/common").Type<Partial<CreateUserDto>>;
export declare class UpdateUserDto extends UpdateUserDto_base {
    isActive?: boolean;
    oldPassword?: string;
    password?: string;
}
export {};
