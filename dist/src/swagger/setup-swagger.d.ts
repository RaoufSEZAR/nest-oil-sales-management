import { INestApplication } from "@nestjs/common";
import { OpenAPIObject } from "@nestjs/swagger";
export declare function buildOpenApiDocument(app: INestApplication): OpenAPIObject;
export declare function logOpenApiProductPaths(document: OpenAPIObject): void;
export declare function setupSwagger(app: INestApplication): void;
