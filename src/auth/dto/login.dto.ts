import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsString, ValidateIf } from "class-validator";

export class LoginDto {
	@ApiPropertyOptional({
		description: "User email (use email or phone)",
		example: "user@example.com",
	})
	@ValidateIf((o: LoginDto) => !o.phone)
	@IsEmail()
	email?: string;

	@ApiPropertyOptional({
		description: "Phone number (legacy login)",
		example: "0501234567",
	})
	@ValidateIf((o: LoginDto) => !o.email)
	@IsString()
	phone?: string;

	@ApiProperty({ description: "User password", example: "password123" })
	@IsString()
	password: string;
}
