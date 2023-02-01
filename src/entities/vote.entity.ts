import {IsNotEmpty} from "class-validator";
import {Column, Entity, JoinColumn, ManyToOne} from "typeorm";

import {Base} from "./base.entity";
import {Quote} from "./quote.entity";

@Entity()
export class Vote extends Base {
	@Column({nullable: false})
	upvote: boolean;

	@ManyToOne(() => Quote, (quote) => quote.id)
	@JoinColumn({name: "quote"})
	@IsNotEmpty()
	quote: Quote;
}
