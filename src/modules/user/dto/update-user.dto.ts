import {IsEmail, IsOptional, IsStrongPassword, ValidateIf} from "class-validator";
import {Match} from "decorators/match.decorator";

export class UpdateUserDto {
	@IsOptional()
	first_name?: string;

	@IsOptional()
	last_name?: string;

	@IsOptional()
	@IsEmail()
	email?: string;

	@IsOptional()
	refresh_token?: string;

	@IsOptional()
	avatar?: string;

	@ValidateIf((o) => typeof o.password === "string" && o.password.length > 0)
	@IsOptional()
	@IsStrongPassword()
	password?: string;

	@ValidateIf((o) => typeof o.confirm_password === "string" && o.confirm_password.length > 0)
	@IsOptional()
	@Match(UpdateUserDto, (field) => field.password, {message: "Passwords do not match."})
	confirm_password?: string;
}
