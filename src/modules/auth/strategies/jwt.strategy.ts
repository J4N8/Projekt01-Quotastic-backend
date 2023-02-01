import {Injectable} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import {PassportStrategy} from "@nestjs/passport";
import {User} from "entities/user.entity";
import {Request} from "express";
import {TokenPayload} from "interfaces/auth.interface";
import {UserService} from "modules/user/user.service";
import {ExtractJwt, Strategy} from "passport-jwt";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
	constructor(private usersService: UserService, configService: ConfigService) {
		super({
			jwtFromRequest: ExtractJwt.fromExtractors([
				(request: Request) => {
					return request?.cookies?.access_token;
				},
			]),
			secretOrKey: configService.get("JWT_SECRET"),
		});
	}

	async validate(payload: TokenPayload): Promise<User> {
		const user = this.usersService.findById(payload.sub);
		return user;
	}
}
