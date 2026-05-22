import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from "src/users/users.service";
import { LoginDto } from "src/auth/dto/login.dto";
import { CreateUserDto } from "src/users/dto/create-user.dto";
import { AuthResponseDto } from "src/auth/dto/auth-response.dto";
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (!user || !user.isActive) return null;
    if (await bcrypt.compare(password, user.password)) {
      const { password: _pw, ...result } = user;
      return result;
    }
    return null;
  }

  async validateUserByPhone(phone: string, password: string): Promise<any> {
    const user = await this.usersService.findByPhoneNumber(phone);
    if (user && await bcrypt.compare(password, user.password)) {
      if (!user.isActive) {
        throw new UnauthorizedException('Account is inactive');
      }
      const { password: _pw, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    let user: Record<string, unknown> | null = null;
    if (loginDto.email) {
      user = await this.validateUser(loginDto.email, loginDto.password);
    } else if (loginDto.phone) {
      user = await this.validateUserByPhone(loginDto.phone, loginDto.password);
    }
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateTokens(user);
  }

  async register(createUserDto: CreateUserDto): Promise<AuthResponseDto> {
    const user = await this.usersService.create(createUserDto);
    const { password: _pw, ...safe } = user;
    return this.generateTokens(safe);
  }

  private generateTokens(user: any): AuthResponseDto {
    const payload = { email: user.email, sub: user.id, role: user.role };
    
    // Access token expires in 15 minutes
    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
    const accessTokenExpiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes from now
    
    // Refresh token expires in 7 days
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
    const refreshTokenExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      access_token_expires_at: accessTokenExpiresAt,
      refresh_token_expires_at: refreshTokenExpiresAt,
    };
  }

  async decodeToken(token: string): Promise<any> {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  async getUserById(userId: string): Promise<any> {
    return this.usersService.findOne(userId);
  }

  async refreshToken(refreshToken: string): Promise<AuthResponseDto> {
    try {
      // Verify the refresh token
      const decoded = this.jwtService.verify(refreshToken);
      
      // Get the user
      const user = await this.usersService.findOne(decoded.sub);
      
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // Generate new tokens
      return this.generateTokens(user);
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
