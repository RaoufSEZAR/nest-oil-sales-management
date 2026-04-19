"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
const throttle_exception_filter_1 = require("./common/filters/throttle-exception.filter");
const setup_swagger_1 = require("./swagger/setup-swagger");
function disableHttpCacheForDocs(app) {
    const instance = app.getHttpAdapter().getInstance();
    if (typeof instance?.use === "function") {
        const noCache = (_req, res, next) => {
            res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
            res.setHeader("Pragma", "no-cache");
            res.setHeader("Expires", "0");
            next();
        };
        instance.use(["/docs", "/docs-json", "/docs-yaml"], noCache);
    }
}
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.setGlobalPrefix("api/v1");
    app.enableCors();
    app.useGlobalFilters(new throttle_exception_filter_1.ThrottleExceptionFilter());
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    disableHttpCacheForDocs(app);
    (0, setup_swagger_1.setupSwagger)(app);
    const port = process.env.PORT || 3000;
    await app.listen(port);
    console.log(`Application is running on: http://localhost:${port}`);
    console.log(`API endpoints: http://localhost:${port}/api/v1`);
    console.log(`Swagger documentation: http://localhost:${port}/docs`);
}
bootstrap();
//# sourceMappingURL=main.js.map