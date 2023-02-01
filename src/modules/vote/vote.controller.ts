import {Controller, HttpCode, HttpStatus, Post, Req} from "@nestjs/common";
import {Request} from "express";

import {Vote} from "../../entities/vote.entity";
import {VoteService} from "./vote.service";

@Controller()
export class VoteController {
	constructor(private readonly voteService: VoteService) {}

	@Post(["quotes/:id/upvote", "quotes/:id/downvote"])
	@HttpCode(HttpStatus.CREATED)
	async create(@Req() req: Request): Promise<Vote> {
		const quote_id: string = req.path.split("/")[2];
		const upvote: boolean = req.path.split("/")[3] === "upvote";
		return this.voteService.create({quote_id: quote_id, upvote: upvote});
	}
}
