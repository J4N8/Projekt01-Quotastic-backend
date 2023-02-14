import {BadRequestException, Injectable, InternalServerErrorException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";

import {Quote} from "../../entities/quote.entity";
import {PaginatedResult} from "../../interfaces/paginated-result.interface";
import Logging from "../../library/logging";
import {AbstractService} from "../common/abstract.service";
import {QuoteDto} from "./dto/quote.dto";

@Injectable()
export class QuoteService extends AbstractService {
	constructor(@InjectRepository(Quote) private readonly quoteRepository: Repository<Quote>) {
		super(quoteRepository);
	}

	async create(quoteDto: QuoteDto): Promise<Quote> {
		try {
			const quote = this.quoteRepository.create({...quoteDto, author: {id: quoteDto.user_id}});
			return this.quoteRepository.save(quote);
		} catch (error) {
			Logging.error(error);
			throw new BadRequestException("Something went wrong while creating a new quote.");
		}
	}

	async update(quoteId: string, quoteDto: QuoteDto): Promise<Quote> {
		const quote = (await this.findById(quoteId)) as Quote;
		try {
			quote.content = quoteDto.content;
			return this.quoteRepository.save(quote);
		} catch (error) {
			Logging.error(error);
			throw new InternalServerErrorException("Something went wrong while updating the quote.");
		}
	}

	async paginateSort(page = 1, relations = [], order): Promise<PaginatedResult> {
		const take = 10;

		try {
			const [data, total] = await this.repository.findAndCount({
				take,
				skip: (page - 1) * take,
				relations,
				order,
			});

			return {
				data: data,
				meta: {
					total,
					page,
					last_page: Math.ceil(total / take),
				},
			};
		} catch (error) {
			Logging.error(error);
			throw new InternalServerErrorException("Something went wrong while searching for a paginated elements.");
		}
	}
}
