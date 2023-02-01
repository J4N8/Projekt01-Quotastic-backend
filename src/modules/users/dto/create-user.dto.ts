import {ApiProperty} from "@nestjs/swagger";
import {IsEmail, IsNotEmpty, IsOptional, IsStrongPassword} from "class-validator";
import {Match} from "decorators/match.decorator";

export class CreateUserDto {
	@ApiProperty({required: false})
	@IsOptional()
	first_name?: string;

	@ApiProperty({required: false})
	@IsOptional()
	last_name?: string;

	@ApiProperty({required: true})
	@IsNotEmpty()
	@IsEmail()
	email: string;

	@ApiProperty({required: true})
	@IsNotEmpty()
	@IsStrongPassword()
	password: string;

	@ApiProperty({required: true})
	@IsNotEmpty()
	@Match(CreateUserDto, (field) => field.password, {message: "Passwords do not match."})
	confirm_password: string;
}
