import {IsNotEmpty} from "class-validator";

export class QuoteDto {
	@IsNotEmpty()
	content: string;

	@IsNotEmpty()
	user_id: string;
}
