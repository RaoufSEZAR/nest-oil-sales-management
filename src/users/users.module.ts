import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersService } from "src/users/users.service";
import { UsersController } from "src/users/users.controller";
import { HrService } from "src/users/hr.service";
import { User } from "src/users/entities/user.entity";
import { Vehicle } from "src/vehicles/entities/vehicle.entity";
import { Center } from "src/centers/entities/center.entity";
import { Invoice } from "src/erp/entities/invoice.entity";
import { Payment } from "src/erp/entities/payment.entity";
import { Expense } from "src/erp/entities/expense.entity";

@Module({
	imports: [
		TypeOrmModule.forFeature([User, Vehicle, Center, Invoice, Payment, Expense]),
	],
	controllers: [UsersController],
	providers: [UsersService, HrService],
	exports: [UsersService, HrService],
})
export class UsersModule {}
