import {Controller, HttpCode, HttpStatus, Param, Post, Req} from "@nestjs/common";
import {Request} from "express";

import {Vote} from "../../entities/vote.entity";
import {VoteDto} from "./dto/vote.dto";
import {VoteService} from "./vote.service";

@Controller()
export class VoteController {
	constructor(private readonly voteService: VoteService) {}

	@Post(["quotes/:id/upvote", "quotes/:id/downvote"])
	@HttpCode(HttpStatus.CREATED)
	async create(@Req() req: Request, @Param("id") quote_id: string): Promise<Vote> {
		const upvote: boolean = req.path.split("/")[3] === "upvote";
		const voteDto: VoteDto = {quote_id: quote_id, upvote: upvote};
		return this.voteService.create(voteDto);
	}
}
