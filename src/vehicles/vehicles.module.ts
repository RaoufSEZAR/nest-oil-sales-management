import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Vehicle } from "src/vehicles/entities/vehicle.entity";
import { Center } from "src/centers/entities/center.entity";
import { User } from "src/users/entities/user.entity";
import { VehiclesService } from "src/vehicles/vehicles.service";
import { VehiclesController } from "src/vehicles/vehicles.controller";

@Module({
	imports: [TypeOrmModule.forFeature([Vehicle, Center, User])],
	controllers: [VehiclesController],
	providers: [VehiclesService],
	exports: [VehiclesService],
})
export class VehiclesModule {}
