import { Repository } from "typeorm";
import { Vehicle } from "src/vehicles/entities/vehicle.entity";
import { Center } from "src/centers/entities/center.entity";
import { User } from "src/users/entities/user.entity";
import { VehicleTrip } from "src/erp/entities/vehicle-trip.entity";
import { CreateVehicleDto } from "src/vehicles/dto/create-vehicle.dto";
import { UpdateVehicleDto } from "src/vehicles/dto/update-vehicle.dto";
export declare class VehiclesService {
    private readonly vehiclesRepo;
    private readonly centersRepo;
    private readonly usersRepo;
    private readonly tripsRepo;
    constructor(vehiclesRepo: Repository<Vehicle>, centersRepo: Repository<Center>, usersRepo: Repository<User>, tripsRepo: Repository<VehicleTrip>);
    private stripRepPassword;
    findAll(filters: {
        centerId?: number;
        active?: boolean;
    }): Promise<Vehicle[]>;
    findOne(id: number): Promise<Vehicle>;
    create(dto: CreateVehicleDto): Promise<Vehicle>;
    update(id: number, dto: UpdateVehicleDto): Promise<Vehicle>;
}
