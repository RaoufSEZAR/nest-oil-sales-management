import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Product, Inventory } from "src/products/entities/product.entity";
import { ProductsService } from "src/products/products.service";
import { ProductsController } from "src/products/products.controller";
import { InventoryService } from "src/products/inventory.service";
import { InventoryController } from "src/products/inventory.controller";
import { UsersModule } from "src/users/users.module";

@Module({
	imports: [
		TypeOrmModule.forFeature([Product, Inventory]),
		UsersModule,
	],
	controllers: [ProductsController, InventoryController],
	providers: [ProductsService, InventoryService],
	exports: [ProductsService, InventoryService],
})
export class ProductsModule {}
