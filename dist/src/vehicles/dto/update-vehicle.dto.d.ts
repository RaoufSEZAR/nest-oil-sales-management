import { CreateVehicleDto } from "src/vehicles/dto/create-vehicle.dto";
declare const UpdateVehicleDto_base: import("@nestjs/common").Type<Partial<CreateVehicleDto>>;
export declare class UpdateVehicleDto extends UpdateVehicleDto_base {
    active?: boolean;
}
export {};
