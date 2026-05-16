import {
	Controller,
	Post,
	Body,
	UseGuards,
	Get,
	Request,
	Headers,
	UnauthorizedException,
	HttpCode,
} from "@nestjs/common";
import {
	ApiTags,
	ApiOperation,
	ApiResponse,
	ApiBearerAuth,
} from "@nestjs/swagger";
import { AuthService } from "src/auth/auth.service";
import { LoginDto } from "src/auth/dto/login.dto";
import { CreateUserDto } from "src/users/dto/create-user.dto";
import { AuthResponseDto, UserProfileDto } from "src/auth/dto/auth-response.dto";
import { RefreshTokenDto } from "src/auth/dto/refresh-token.dto";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { Throttle } from "@nestjs/throttler";
import { ThrottleAuth } from "src/common/decorators/throttle-auth.decorator";

@ApiTags("Authentication")
@Controller("auth")
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@ThrottleAuth()
	@Post("login")
	@ApiOperation({ summary: "User login" })
	@ApiResponse({
		status: 200,
		description: "Login successful",
		type: AuthResponseDto,
	})
	@ApiResponse({ status: 401, description: "Invalid credentials" })
	async login(@Body() loginDto: LoginDto) {
		return this.authService.login(loginDto);
	}

	@Post("signup")
	@ThrottleAuth()
	@ApiOperation({ summary: "User registration (legacy alias for /register)" })
	@ApiResponse({
		status: 201,
		description: "Registration successful",
		type: AuthResponseDto,
	})
	async signup(@Body() createUserDto: CreateUserDto) {
		return this.authService.register(createUserDto);
	}

	@Post("logout")
	@HttpCode(200)
	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth()
	@ApiOperation({ summary: "Logout (stateless; legacy compatibility)" })
	logout() {
		return { message: "Logged out successfully" };
	}

	@ThrottleAuth()
	@Post("register")
	@ApiOperation({ summary: "User registration" })
	@ApiResponse({
		status: 201,
		description: "Registration successful",
		type: AuthResponseDto,
	})
	@ApiResponse({ status: 400, description: "Bad request" })
	async register(@Body() createUserDto: CreateUserDto) {
		return this.authService.register(createUserDto);
	}

	@Get("profile")
	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth()
	@ApiOperation({ summary: "Get user profile" })
	@ApiResponse({
		status: 200,
		description: "Profile retrieved successfully",
		type: UserProfileDto,
	})
	@ApiResponse({ status: 401, description: "Unauthorized" })
	async getProfile(@Request() req): Promise<UserProfileDto> {
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

	@Get("me")
	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth()
	@ApiOperation({ summary: "Get user profile (alias for /profile)" })
	@ApiResponse({
		status: 200,
		description: "Profile retrieved successfully",
		type: UserProfileDto,
	})
	@ApiResponse({ status: 401, description: "Unauthorized" })
	async getMe(@Request() req): Promise<UserProfileDto> {
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

	@Post("refresh")
	@ApiOperation({ summary: "Refresh access token" })
	@ApiResponse({
		status: 200,
		description: "Token refreshed successfully",
		type: AuthResponseDto,
	})
	@ApiResponse({ status: 401, description: "Invalid refresh token" })
	async refresh(@Body() refreshTokenDto: RefreshTokenDto) {
		return this.authService.refreshToken(refreshTokenDto.refresh_token);
	}

	@Post("decode")
	@ApiOperation({ summary: "Decode token to get user information" })
	@ApiResponse({
		status: 200,
		description: "Token decoded successfully",
		type: UserProfileDto,
	})
	@ApiResponse({ status: 401, description: "Invalid token" })
	async decodeToken(
		@Headers("authorization") authorization: string
	): Promise<UserProfileDto> {
		if (!authorization || !authorization.startsWith("Bearer ")) {
			throw new UnauthorizedException(
				"Authorization header missing or invalid"
			);
		}

		const token = authorization.substring(7); // Remove 'Bearer ' prefix
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
}
