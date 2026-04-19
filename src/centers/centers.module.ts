import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Center } from "src/centers/entities/center.entity";
import { User } from "src/users/entities/user.entity";
import { Vehicle } from "src/vehicles/entities/vehicle.entity";
import { CentersService } from "src/centers/centers.service";
import { CentersController } from "src/centers/centers.controller";

@Module({
	imports: [TypeOrmModule.forFeature([Center, User, Vehicle])],
	controllers: [CentersController],
	providers: [CentersService],
	exports: [CentersService],
})
export class CentersModule {}
