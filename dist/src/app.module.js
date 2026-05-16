"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const user_entity_1 = require("./users/entities/user.entity");
const center_entity_1 = require("./centers/entities/center.entity");
const vehicle_entity_1 = require("./vehicles/entities/vehicle.entity");
const product_entity_1 = require("./products/entities/product.entity");
const centers_module_1 = require("./centers/centers.module");
const vehicles_module_1 = require("./vehicles/vehicles.module");
const products_module_1 = require("./products/products.module");
const erp_module_1 = require("./erp/erp.module");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const throttler_1 = require("@nestjs/throttler");
const core_1 = require("@nestjs/core");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: process.env.NODE_ENV === "production"
                    ? ["production.env", "config.env"]
                    : "config.env",
            }),
            throttler_1.ThrottlerModule.forRoot([
                {
                    ttl: 60,
                    limit: 20,
                },
            ]),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => ({
                    type: "postgres",
                    host: configService.get("DB_HOST"),
                    port: Number(configService.get("DB_PORT")) || 5432,
                    username: configService.get("DB_USERNAME"),
                    password: configService.get("DB_PASSWORD"),
                    database: configService.get("DB_NAME"),
                    entities: [user_entity_1.User, center_entity_1.Center, vehicle_entity_1.Vehicle, product_entity_1.Product, product_entity_1.Inventory],
                    autoLoadEntities: true,
                    synchronize: configService.get("DB_SYNCHRONIZE") !== "false",
                    logging: configService.get("NODE_ENV") === "development",
                    ssl: configService.get("DB_SSL") === "true"
                        ? { rejectUnauthorized: false }
                        : false,
                }),
                inject: [config_1.ConfigService],
            }),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            centers_module_1.CentersModule,
            vehicles_module_1.VehiclesModule,
            products_module_1.ProductsModule,
            erp_module_1.ErpModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService, { provide: core_1.APP_GUARD, useClass: throttler_1.ThrottlerGuard }],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map