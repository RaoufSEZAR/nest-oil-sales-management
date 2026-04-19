import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Product, Inventory } from "src/products/entities/product.entity";
import { ProductsService } from "src/products/products.service";
import { ProductsController } from "src/products/products.controller";

@Module({
	imports: [TypeOrmModule.forFeature([Product, Inventory])],
	controllers: [ProductsController],
	providers: [ProductsService],
	exports: [ProductsService],
})
export class ProductsModule {}
