import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from "src/users/users.service";
import { UsersController } from "src/users/users.controller";
import { User } from "src/users/entities/user.entity";
import { Vehicle } from "src/vehicles/entities/vehicle.entity";
import { Center } from "src/centers/entities/center.entity";

@Module({
  imports: [TypeOrmModule.forFeature([User, Vehicle, Center])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
