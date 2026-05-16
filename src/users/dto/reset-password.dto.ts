import { ApiProperty } from "@nestjs/swagger";
import { IsString, MinLength } from "class-validator";

export class ResetPasswordDto {
	@ApiProperty({
		description: "New password (minimum 4 characters, legacy ERP rule)",
		example: "1234",
		minLength: 4,
	})
	@IsString()
	@MinLength(4)
	password: string;
}
