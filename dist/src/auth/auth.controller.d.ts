import { AuthService } from "src/auth/auth.service";
import { LoginDto } from "src/auth/dto/login.dto";
import { CreateUserDto } from "src/users/dto/create-user.dto";
import { AuthResponseDto, UserProfileDto } from "src/auth/dto/auth-response.dto";
import { RefreshTokenDto } from "src/auth/dto/refresh-token.dto";
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto): Promise<AuthResponseDto>;
    signup(createUserDto: CreateUserDto): Promise<AuthResponseDto>;
    logout(): {
        message: string;
    };
    register(createUserDto: CreateUserDto): Promise<AuthResponseDto>;
    getProfile(req: any): Promise<UserProfileDto>;
    getMe(req: any): Promise<UserProfileDto>;
    refresh(refreshTokenDto: RefreshTokenDto): Promise<AuthResponseDto>;
    decodeToken(authorization: string): Promise<UserProfileDto>;
}
