import {Exclude} from "class-transformer";
import {IsNotEmpty} from "class-validator";
import {Column, Entity, JoinColumn, ManyToOne, OneToMany} from "typeorm";

import {Base} from "./base.entity";
import {User} from "./user.entity";
import {Vote} from "./vote.entity";

@Entity()
export class Quote extends Base {
	@Column({default: 0})
	score: number;

	@Column({nullable: false})
	content: string;

	@ManyToOne(() => User, (author) => author.my_quotes)
	@JoinColumn({name: "author"})
	@IsNotEmpty()
	author: User;

	@Exclude()
	@OneToMany(() => Vote, (vote) => vote.quote)
	votes: Vote[];
}
