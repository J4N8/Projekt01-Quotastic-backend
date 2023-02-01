import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";

import {Quote} from "../../entities/quote.entity";
import {QuoteController} from "./quote.controller";
import {QuoteService} from "./quote.service";

@Module({
	imports: [TypeOrmModule.forFeature([Quote])],
	controllers: [QuoteController],
	providers: [QuoteService],
})
export class QuoteModule {}
