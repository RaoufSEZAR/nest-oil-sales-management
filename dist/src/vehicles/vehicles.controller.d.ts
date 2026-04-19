import { VehiclesService } from "src/vehicles/vehicles.service";
import { CreateVehicleDto } from "src/vehicles/dto/create-vehicle.dto";
import { UpdateVehicleDto } from "src/vehicles/dto/update-vehicle.dto";
export declare class VehiclesController {
    private readonly vehiclesService;
    constructor(vehiclesService: VehiclesService);
    findAll(centerIdRaw?: string, activeRaw?: string): Promise<import("./entities/vehicle.entity").Vehicle[]>;
    findOne(id: number): Promise<import("./entities/vehicle.entity").Vehicle>;
    create(dto: CreateVehicleDto): Promise<import("./entities/vehicle.entity").Vehicle>;
    update(id: number, dto: UpdateVehicleDto): Promise<import("./entities/vehicle.entity").Vehicle>;
}
