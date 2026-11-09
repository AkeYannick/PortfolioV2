import { Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../prisma/prisma.service";
import { hacherMotDePasse, verifierMotDePasse } from "./password.util";
import { lireEnv } from "../env";

export type SessionUtilisateur = { id: string; email: string };

/** Empreinte utilisée quand l'email n'existe pas : le temps de réponse reste constant. */
const HACHAGE_FACTICE = "scrypt$32768$8$1$" + "0".repeat(32) + "$" + "0".repeat(64);

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);

    constructor(
        private readonly prisma: PrismaService,
        private readonly jwt: JwtService,
    ) {}

    /** Crée l'utilisateur admin décrit dans .env au premier démarrage. */
    async garantirAdmin(): Promise<void> {
        const env = lireEnv();
        const existant = await this.prisma.adminUser.findUnique({ where: { email: env.adminEmail } });
        if (existant) return;

        await this.prisma.adminUser.create({
            data: { email: env.adminEmail, motDePasseHash: await hacherMotDePasse(env.adminPassword) },
        });
        this.logger.log(`Administrateur créé : ${env.adminEmail}`);
    }

    async connexion(email: string, motDePasse: string): Promise<{ token: string; email: string }> {
        const normalise = email.toLowerCase();
        const utilisateur = await this.prisma.adminUser.findUnique({ where: { email: normalise } });

        const ok = await verifierMotDePasse(motDePasse, utilisateur?.motDePasseHash ?? HACHAGE_FACTICE);
        if (!utilisateur || !ok) {
            throw new UnauthorizedException("Identifiants invalides");
        }

        const session: SessionUtilisateur = { id: utilisateur.id, email: utilisateur.email };
        return { token: await this.jwt.signAsync(session), email: session.email };
    }
}
