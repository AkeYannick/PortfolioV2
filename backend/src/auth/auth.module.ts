import { Module } from "@nestjs/common";
import { JwtModule, type JwtSignOptions } from "@nestjs/jwt";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtGuard } from "./jwt.guard";
import { lireEnv } from "../env";

@Module({
    imports: [
        JwtModule.registerAsync({
            useFactory: () => {
                const env = lireEnv();
                return {
                    secret: env.jwtSecret,
                    // Durée déjà validée par lireEnv() ; le cast correspond au type ms.StringValue.
                    signOptions: {
                        expiresIn: env.jwtTtl as JwtSignOptions["expiresIn"],
                        algorithm: "HS256",
                    },
                };
            },
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtGuard],
    exports: [AuthService, JwtGuard, JwtModule],
})
export class AuthModule {}
