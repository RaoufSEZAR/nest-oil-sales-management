import { VehiclesService } from "src/vehicles/vehicles.service";
import { CreateVehicleDto } from "src/vehicles/dto/create-vehicle.dto";
import { UpdateVehicleDto } from "src/vehicles/dto/update-vehicle.dto";
import { Vehicle } from "src/vehicles/entities/vehicle.entity";
export declare class VehiclesController {
    private readonly vehiclesService;
    constructor(vehiclesService: VehiclesService);
    findAll(centerIdRaw?: string, activeRaw?: string): Promise<Vehicle[]>;
    findOne(id: number): Promise<Vehicle>;
    create(dto: CreateVehicleDto): Promise<Vehicle>;
    updatePut(id: number, dto: UpdateVehicleDto): Promise<Vehicle>;
    update(id: number, dto: UpdateVehicleDto): Promise<Vehicle>;
}
