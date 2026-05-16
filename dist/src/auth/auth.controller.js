"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_service_1 = require("./auth.service");
const login_dto_1 = require("./dto/login.dto");
const create_user_dto_1 = require("../users/dto/create-user.dto");
const auth_response_dto_1 = require("./dto/auth-response.dto");
const refresh_token_dto_1 = require("./dto/refresh-token.dto");
const jwt_auth_guard_1 = require("./guards/jwt-auth.guard");
const throttle_auth_decorator_1 = require("../common/decorators/throttle-auth.decorator");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async login(loginDto) {
        return this.authService.login(loginDto);
    }
    async signup(createUserDto) {
        return this.authService.register(createUserDto);
    }
    logout() {
        return { message: "Logged out successfully" };
    }
    async register(createUserDto) {
        return this.authService.register(createUserDto);
    }
    async getProfile(req) {
        const user = await this.authService.getUserById(req.user.userId);
        return {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            isActive: user.isActive,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            gender: user.gender,
            phoneNumber: user.phoneNumber,
            address: user.address,
            preferredLang: user.preferredLang,
            region: user.region,
        };
    }
    async getMe(req) {
        const user = await this.authService.getUserById(req.user.userId);
        return {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            isActive: user.isActive,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            gender: user.gender,
            phoneNumber: user.phoneNumber,
            address: user.address,
            preferredLang: user.preferredLang,
            region: user.region,
        };
    }
    async refresh(refreshTokenDto) {
        return this.authService.refreshToken(refreshTokenDto.refresh_token);
    }
    async decodeToken(authorization) {
        if (!authorization || !authorization.startsWith("Bearer ")) {
            throw new common_1.UnauthorizedException("Authorization header missing or invalid");
        }
        const token = authorization.substring(7);
        const decoded = await this.authService.decodeToken(token);
        const user = await this.authService.getUserById(decoded.sub);
        return {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            isActive: user.isActive,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, throttle_auth_decorator_1.ThrottleAuth)(),
    (0, common_1.Post)("login"),
    (0, swagger_1.ApiOperation)({ summary: "User login" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Login successful",
        type: auth_response_dto_1.AuthResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "Invalid credentials" }),
    openapi.ApiResponse({ status: 201, type: require("./dto/auth-response.dto").AuthResponseDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)("signup"),
    (0, throttle_auth_decorator_1.ThrottleAuth)(),
    (0, swagger_1.ApiOperation)({ summary: "User registration (legacy alias for /register)" }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: "Registration successful",
        type: auth_response_dto_1.AuthResponseDto,
    }),
    openapi.ApiResponse({ status: 201, type: require("./dto/auth-response.dto").AuthResponseDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signup", null);
__decorate([
    (0, common_1.Post)("logout"),
    (0, common_1.HttpCode)(200),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: "Logout (stateless; legacy compatibility)" }),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "logout", null);
__decorate([
    (0, throttle_auth_decorator_1.ThrottleAuth)(),
    (0, common_1.Post)("register"),
    (0, swagger_1.ApiOperation)({ summary: "User registration" }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: "Registration successful",
        type: auth_response_dto_1.AuthResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "Bad request" }),
    openapi.ApiResponse({ status: 201, type: require("./dto/auth-response.dto").AuthResponseDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Get)("profile"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: "Get user profile" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Profile retrieved successfully",
        type: auth_response_dto_1.UserProfileDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "Unauthorized" }),
    openapi.ApiResponse({ status: 200, type: require("./dto/auth-response.dto").UserProfileDto }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Get)("me"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: "Get user profile (alias for /profile)" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Profile retrieved successfully",
        type: auth_response_dto_1.UserProfileDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "Unauthorized" }),
    openapi.ApiResponse({ status: 200, type: require("./dto/auth-response.dto").UserProfileDto }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getMe", null);
__decorate([
    (0, common_1.Post)("refresh"),
    (0, swagger_1.ApiOperation)({ summary: "Refresh access token" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Token refreshed successfully",
        type: auth_response_dto_1.AuthResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "Invalid refresh token" }),
    openapi.ApiResponse({ status: 201, type: require("./dto/auth-response.dto").AuthResponseDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [refresh_token_dto_1.RefreshTokenDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refresh", null);
__decorate([
    (0, common_1.Post)("decode"),
    (0, swagger_1.ApiOperation)({ summary: "Decode token to get user information" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Token decoded successfully",
        type: auth_response_dto_1.UserProfileDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "Invalid token" }),
    openapi.ApiResponse({ status: 201, type: require("./dto/auth-response.dto").UserProfileDto }),
    __param(0, (0, common_1.Headers)("authorization")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "decodeToken", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)("Authentication"),
    (0, common_1.Controller)("auth"),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map