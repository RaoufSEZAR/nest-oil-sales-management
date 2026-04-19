import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from "src/users/dto/create-user.dto";
import { IsOptional, IsBoolean, IsString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({ description: 'User active status', example: true, required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ description: 'Old password (required when changing password)', example: 'oldpassword123', required: false })
  @IsOptional()
  @IsString()
  oldPassword?: string;

  @ApiProperty({ description: 'New password (minimum 6 characters)', example: 'newpassword123', required: false })
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;
}
