import {Column, Entity, JoinColumn, ManyToOne} from "typeorm";

import {Base} from "./base.entity";
import {User} from "./user.entity";

@Entity()
export class Quote extends Base {
	@Column({default: 0})
	score: number;

	@Column({nullable: false})
	content: string;

	@ManyToOne(() => User, (user) => user.my_quotes)
	@JoinColumn({name: "user_id"})
	user: User;
}
