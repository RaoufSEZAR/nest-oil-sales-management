import { ApiProperty } from "@nestjs/swagger";
import {
	IsEmail,
	IsString,
	MinLength,
	MaxLength,
	IsEnum,
	IsOptional,
} from "class-validator";
import { UserRole, DEFAULT_USER_ROLE } from "src/users/enums/user-role.enum";

export class CreateUserDto {
	@ApiProperty({ description: "User email address", example: "user@gmail.com" })
	@IsEmail()
	email: string;

	@ApiProperty({
		description: "User password",
		example: "123456",
		minLength: 6,
	})
	@IsString()
	@MinLength(6)
	password: string;

	@ApiProperty({ description: "User first name", example: "John" })
	@IsString()
	@MinLength(2)
	@MaxLength(50)
	firstName: string;

	@ApiProperty({ description: "User last name", example: "Doe" })
	@IsString()
	@MinLength(2)
	@MaxLength(50)
	lastName: string;

	@ApiProperty({
		description: "User phone number",
		example: "+1234567890",
		required: false,
	})
	@IsOptional()
	@IsString()
	phoneNumber?: string;

	@ApiProperty({
		description: "User address",
		example: "123 Main St, City, Country",
		required: false,
	})
	@IsOptional()
	@IsString()
	@MaxLength(500)
	address?: string;

	@ApiProperty({
		description: "Preferred language",
		example: "en",
		required: false,
	})
	@IsOptional()
	@IsString()
	@MaxLength(10)
	preferredLang?: string;

	@ApiProperty({ description: "User region", example: "US", required: false })
	@IsOptional()
	@IsString()
	@MaxLength(50)
	region?: string;

	@ApiProperty({
		description: "User role",
		enum: UserRole,
		example: UserRole.USER,
		default: DEFAULT_USER_ROLE,
		required: false,
	})
	@IsOptional()
	@IsEnum(UserRole)
	role?: UserRole = DEFAULT_USER_ROLE;
}
