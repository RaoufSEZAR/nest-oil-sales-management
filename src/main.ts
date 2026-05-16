import { NestFactory } from "@nestjs/core";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import type { Request, Response, NextFunction } from "express";
import { AppModule } from "src/app.module";
import { ThrottleExceptionFilter } from "src/common/filters/throttle-exception.filter";
import { setupSwagger } from "src/swagger/setup-swagger";

function disableHttpCacheForDocs(app: INestApplication) {
	const instance = app.getHttpAdapter().getInstance() as {
		use?: (handler: (req: Request, res: Response, next: NextFunction) => void) => void;
	};
	if (typeof instance?.use !== "function") return;

	instance.use((req: Request, res: Response, next: NextFunction) => {
		const path = req.path ?? "";
		if (path === "/docs" || path.startsWith("/docs/") || path === "/docs-json" || path === "/docs-yaml") {
			res.setHeader(
				"Cache-Control",
				"no-store, no-cache, must-revalidate, proxy-revalidate",
			);
			res.setHeader("Pragma", "no-cache");
			res.setHeader("Expires", "0");
		}
		next();
	});
}

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	// Set global prefix
	app.setGlobalPrefix("api/v1");

	// Enable CORS
	app.enableCors();

	// Global exception filter for throttling
	app.useGlobalFilters(new ThrottleExceptionFilter());

	// Global validation pipe
	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			forbidNonWhitelisted: true,
			transform: true,
		}),
	);

	disableHttpCacheForDocs(app);
	setupSwagger(app);

	const port = process.env.PORT || 3000;
	await app.listen(port);
	console.log(`Application is running on: http://localhost:${port}`);
	console.log(`API endpoints: http://localhost:${port}/api/v1`);
	console.log(`Swagger documentation: http://localhost:${port}/docs`);
}
bootstrap();
