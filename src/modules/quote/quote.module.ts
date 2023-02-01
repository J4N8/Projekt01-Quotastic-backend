import {Module} from "@nestjs/common";

import {QuoteService} from "./quote.service";

@Module({
	providers: [QuoteService],
})
export class QuoteModule {}
