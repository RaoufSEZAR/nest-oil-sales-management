import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AuthModule } from "src/auth/auth.module";
import { UsersModule } from "src/users/users.module";
import { User } from "src/users/entities/user.entity";
import { Center } from "src/centers/entities/center.entity";
import { Vehicle } from "src/vehicles/entities/vehicle.entity";
import { Product, Inventory } from "src/products/entities/product.entity";
import { CentersModule } from "src/centers/centers.module";
import { VehiclesModule } from "src/vehicles/vehicles.module";
import { ProductsModule } from "src/products/products.module";
import { ErpModule } from "src/erp/erp.module";
import { AppController } from "src/app.controller";
import { AppService } from "src/app.service";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { APP_GUARD } from "@nestjs/core";

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: "config.env",
		}),
		ThrottlerModule.forRoot([
			{
				ttl: 60,
				limit: 20,
			},
		]),
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: (configService: ConfigService) => ({
				type: "postgres",
				host: configService.get("DB_HOST"),
				port: Number(configService.get("DB_PORT")) || 5432,
				username: configService.get("DB_USERNAME"),
				password: configService.get("DB_PASSWORD"),
				database: configService.get("DB_NAME"),
				entities: [User, Center, Vehicle, Product, Inventory],
				autoLoadEntities: true,
				synchronize: configService.get("NODE_ENV") !== "production",
				logging: configService.get("NODE_ENV") === "development",
				ssl:
					configService.get("DB_SSL") === "true"
						? { rejectUnauthorized: false }
						: false,
			}),
			inject: [ConfigService],
		}),
		AuthModule,
		UsersModule,
		CentersModule,
		VehiclesModule,
		ProductsModule,
		ErpModule,
	],
	controllers: [AppController],
	providers: [AppService, { provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
