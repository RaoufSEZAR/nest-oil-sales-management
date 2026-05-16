import { JwtService } from '@nestjs/jwt';
import { UsersService } from "src/users/users.service";
import { LoginDto } from "src/auth/dto/login.dto";
import { CreateUserDto } from "src/users/dto/create-user.dto";
import { AuthResponseDto } from "src/auth/dto/auth-response.dto";
export declare class AuthService {
    private usersService;
    private jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    validateUser(email: string, password: string): Promise<any>;
    validateUserByPhone(phone: string, password: string): Promise<any>;
    login(loginDto: LoginDto): Promise<AuthResponseDto>;
    register(createUserDto: CreateUserDto): Promise<AuthResponseDto>;
    private generateTokens;
    decodeToken(token: string): Promise<any>;
    getUserById(userId: string): Promise<any>;
    refreshToken(refreshToken: string): Promise<AuthResponseDto>;
}
