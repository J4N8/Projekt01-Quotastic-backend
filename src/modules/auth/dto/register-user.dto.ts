import {IsEmail, IsNotEmpty, IsOptional, IsStrongPassword} from "class-validator";
import {Match} from "decorators/match.decorator";

export class RegisterUserDto {
	@IsOptional()
	first_name?: string;

	@IsOptional()
	last_name?: string;

	@IsNotEmpty()
	@IsEmail()
	email: string;

	@IsNotEmpty()
	@IsStrongPassword()
	password: string;

	@IsNotEmpty()
	@Match(RegisterUserDto, (field) => field.password, {message: "Passwords do not match."})
	confirm_password: string;
}
