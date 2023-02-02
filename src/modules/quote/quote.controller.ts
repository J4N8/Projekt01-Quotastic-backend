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
import {Quote} from "../../entities/quote.entity";
import {PaginatedResult} from "../../interfaces/paginated-result.interface";
import {QuoteDto} from "./dto/quote.dto";
import {QuoteService} from "./quote.service";

@Controller()
export class QuoteController {
	constructor(private readonly quoteService: QuoteService) {}

	@Get("quotes")
	@HttpCode(HttpStatus.OK)
	async findAll(@Query("page") page: number): Promise<PaginatedResult> {
		return this.quoteService.paginate(page, ["author"]);
	}

	@Get("quotes/:id")
	@HttpCode(HttpStatus.OK)
	async findOne(@Param("id") id: string): Promise<Quote> {
		return this.quoteService.findById(id, ["author"]);
	}

	@Post("me/myquote")
	@HttpCode(HttpStatus.CREATED)
	async create(@Body() quoteDto: QuoteDto): Promise<Quote> {
		return this.quoteService.create(quoteDto);
	}

	@Patch("me/myquote/:id")
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

	@Delete("me/myquote/:id")
	@HttpCode(HttpStatus.OK)
	async remove(@Param("id") id: string, @GetCurrentUserId() userId: string): Promise<Quote> {
		const quote: Quote = await this.quoteService.findById(id, ["author"]);
		if (quote.author.id !== userId) {
			throw new BadRequestException("You can only delete your own quotes.");
		}
		return this.quoteService.remove(id);
	}
}
