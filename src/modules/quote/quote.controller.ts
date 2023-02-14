import {
	BadRequestException,
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Patch,
	Post,
	Query,
} from "@nestjs/common";

import {GetCurrentUserId} from "../../decorators/get-current-user-id.decorator";
import {Public} from "../../decorators/public.decorator";
import {Quote} from "../../entities/quote.entity";
import {PaginatedResult} from "../../interfaces/paginated-result.interface";
import {QuoteDto} from "./dto/quote.dto";
import {QuoteService} from "./quote.service";

@Controller("quotes")
export class QuoteController {
	constructor(private readonly quoteService: QuoteService) {}

	@Public()
	@Get()
	@HttpCode(HttpStatus.OK)
	async findAll(@Query("page") page: number): Promise<PaginatedResult> {
		return this.quoteService.paginate(page, ["author"]);
	}

	@Public()
	@Get("sorted_score")
	@HttpCode(HttpStatus.OK)
	async findAllSortedScore(@Query("page") page: number): Promise<PaginatedResult> {
		return this.quoteService.paginateSort(page, ["author"], {score: "DESC"});
	}

	@Public()
	@Get("sorted_recent")
	@HttpCode(HttpStatus.OK)
	async findAllSortedRecent(@Query("page") page: number): Promise<PaginatedResult> {
		return this.quoteService.paginateSort(page, ["author"], {created_at: "DESC"});
	}

	@Public()
	@Get("/:id")
	@HttpCode(HttpStatus.OK)
	async findOne(@Param("id") id: string): Promise<Quote> {
		return this.quoteService.findById(id, ["author"]);
	}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	async create(@Body() quoteDto: QuoteDto): Promise<Quote> {
		return this.quoteService.create(quoteDto);
	}

	@Patch("/:id")
	@HttpCode(HttpStatus.OK)
	async update(
		@Param("id") id: string,
		@Body() quoteDto: QuoteDto,
		@GetCurrentUserId() userId: string,
	): Promise<Quote> {
		const quote: Quote = await this.quoteService.findById(id, ["author"]);
		if (quote.author.id !== userId) {
			throw new BadRequestException("You can only update your own quotes.");
		}
		return this.quoteService.update(id, quoteDto);
	}

	@Delete("/:id")
	@HttpCode(HttpStatus.OK)
	async remove(@Param("id") id: string, @GetCurrentUserId() userId: string): Promise<Quote> {
		const quote: Quote = await this.quoteService.findById(id, ["author"]);
		if (quote.author.id !== userId) {
			throw new BadRequestException("You can only delete your own quotes.");
		}
		return this.quoteService.remove(id);
	}
}
