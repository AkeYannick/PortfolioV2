import { Body, Controller, Get, HttpCode, Post, Req, UseGuards } from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import type { Request } from "express";
import { AuthService } from "./auth.service";
import { JwtGuard } from "./jwt.guard";
import { LoginDto } from "./dto/login.dto";

@Controller("auth")
export class AuthController {
    constructor(private readonly auth: AuthService) {}

    /** Connexion : volontairement limitée (voir ThrottlerGuard global + règle ci-dessous). */
    @HttpCode(200)
    @Throttle({ default: { limit: 5, ttl: 60_000 } })
    @Post("connexion")
    connexion(@Body() dto: LoginDto) {
        return this.auth.connexion(dto.email, dto.motDePasse);
    }

    /** Le dashboard vérifie périodiquement que le jeton est encore valable. */
    @UseGuards(JwtGuard)
    @Get("moi")
    moi(@Req() requete: Request) {
        return requete.utilisateur;
    }
}
