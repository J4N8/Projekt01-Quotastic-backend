import {Module} from "@nestjs/common";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {JwtModule} from "@nestjs/jwt";
import {PassportModule} from "@nestjs/passport";
import {UserModule} from "modules/user/user.module";

import {AuthController} from "./auth.controller";
import {AuthService} from "./auth.service";
import {JwtStrategy} from "./strategies/jwt.strategy";
import {JwtRefreshStrategy} from "./strategies/jwt-refresh.strategy";
import {LocalStrategy} from "./strategies/local.strategy";

@Module({
	imports: [
		UserModule,
		PassportModule,
		JwtModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => ({
				secret: configService.get("JWT_SECRET"),
				signOptions: {expiresIn: `${configService.get("JWT_SECRET_EXPIRES")}s`},
			}),
		}),
	],
	controllers: [AuthController],
	providers: [AuthService, LocalStrategy, JwtStrategy, JwtRefreshStrategy],
	exports: [AuthService],
})
export class AuthModule {}
