import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from "src/users/enums/user-role.enum";

export class AuthResponseDto {
  @ApiProperty({ description: 'JWT access token' })
  access_token: string;

  @ApiProperty({ description: 'JWT refresh token' })
  refresh_token: string;

  @ApiProperty({ description: 'Access token expiration date' })
  access_token_expires_at: Date;

  @ApiProperty({ description: 'Refresh token expiration date' })
  refresh_token_expires_at: Date;
}

export class UserProfileDto {
  @ApiProperty({ description: 'User ID (UUID)' })
  id: string;

  @ApiProperty({ description: 'User email address' })
  email: string;

  @ApiProperty({ description: 'User first name' })
  firstName: string;

  @ApiProperty({ description: 'User last name' })
  lastName: string;

  @ApiProperty({ description: 'User role', enum: UserRole })
  role: UserRole;

  @ApiProperty({ description: 'User active status' })
  isActive: boolean;

  @ApiProperty({ description: 'Account creation date' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update date' })
  updatedAt: Date;
  @ApiProperty({ description: 'User gender' })
  gender?: string;

  @ApiProperty({ description: 'User phone number' })
  phoneNumber?: string;
  @ApiProperty({ description: 'User address' })
  address?: string;

  @ApiProperty({ description: 'Preferred language' })
  preferredLang?: string;
  @ApiProperty({ description: 'User region' })
  region?: string;
}
