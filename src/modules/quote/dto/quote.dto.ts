import {IsNotEmpty} from "class-validator";

export class QuoteDto {
	@IsNotEmpty()
	content: string;
}
