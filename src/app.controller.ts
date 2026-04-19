import { Controller, Get } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";

@ApiTags("Health")
@Controller()
export class AppController {
	@Get()
	@ApiOperation({ summary: "Health check" })
	@ApiResponse({ status: 200, description: "Application is running" })
	getHello(): string {
		return "Oil Sales API is running!";
	}

	@Get("health")
	@ApiOperation({ summary: "Detailed health check" })
	@ApiResponse({ status: 200, description: "Health status" })
	getHealth() {
		return {
			status: "ok",
			timestamp: new Date().toISOString(),
			uptime: process.uptime(),
			environment: process.env.NODE_ENV || "development",
		};
	}
}
