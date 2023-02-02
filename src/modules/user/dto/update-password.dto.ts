import {IsStrongPassword, ValidateIf} from "class-validator";

export class UpdatePasswordDto {
	@ValidateIf((o) => typeof o.current_password === "string" && o.current_password.length > 0)
	@IsStrongPassword()
	password: string;
}
