import { ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import type { Request } from "express";

export type PorteurAcces = { id: string; email: string };

/** Vérifie l'en-tête `Authorization: Bearer <jwt>` et attache l'identité à la requête. */
@Injectable()
export class JwtGuard {
    constructor(private readonly jwt: JwtService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requete = context.switchToHttp().getRequest<Request>();
        const entete = requete.headers.authorization;
        if (!entete?.startsWith("Bearer ")) {
            throw new UnauthorizedException("Jeton manquant");
        }

        try {
            requete.utilisateur = await this.jwt.verifyAsync<PorteurAcces>(entete.slice(7));
        } catch {
            throw new UnauthorizedException("Jeton invalide ou expiré");
        }
        return true;
    }
}
