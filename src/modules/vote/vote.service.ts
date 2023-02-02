import {BadRequestException, Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";

import {Vote} from "../../entities/vote.entity";
import Logging from "../../library/logging";
import {AbstractService} from "../common/abstract.service";
import {VoteDto} from "./dto/vote.dto";

@Injectable()
export class VoteService extends AbstractService {
	constructor(@InjectRepository(Vote) private readonly voteRepository: Repository<Vote>) {
		super(voteRepository);
	}

	async create(voteDto: VoteDto): Promise<Vote> {
		try {
			const vote = this.voteRepository.create({...voteDto, quote: {id: voteDto.quote_id}});
			return this.voteRepository.save(vote);
		} catch (error) {
			Logging.error(error);
			throw new BadRequestException("Something went wrong while creating a new vote.");
		}
	}
}
