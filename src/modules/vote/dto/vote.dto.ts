import {IsNotEmpty} from "class-validator";

export class VoteDto {
	@IsNotEmpty()
	quote_id: string;

	@IsNotEmpty()
	upvote: boolean;
}
