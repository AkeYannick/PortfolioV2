import "reflect-metadata";
import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import type { NestExpressApplication } from "@nestjs/platform-express";
import helmet from "helmet";
import { AppModule } from "./app.module";
import { AuthService } from "./auth/auth.service";
import { lireEnv } from "./env";

async function principal() {
    const env = lireEnv();

    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
        // En production, ne pas exposer de détails internes dans les logs.
        logger: env.estProduction ? ["error", "warn", "log"] : ["error", "warn", "log", "debug", "verbose"],
    });

    app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));

    // Images importées depuis le dashboard. Enregistré après helmet pour que les
    // réponses statiques portent aussi CORP: cross-origin (site public sur un autre port).
    app.useStaticAssets(env.dossierUploads, {
        prefix: "/uploads/",
        index: false,
        dotfiles: "ignore",
        maxAge: "1y",
        immutable: true,
    });

    app.enableCors({
        origin: (origine: string | undefined, callback: (erreur: Error | null, autoriser?: boolean) => void) => {
            // Les requêtes sans en-tête Origin (curl, healthcheck, même serveur) sont acceptées.
            if (!origine) return callback(null, true);
            if (env.originesAutorisees.includes(origine)) return callback(null, true);
            return callback(new Error(`Origine non autorisée : ${origine}`), false);
        },
        methods: ["GET", "POST", "PATCH", "DELETE"],
        maxAge: 86400,
    });

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
            forbidUnknownValues: true,
        }),
    );

    // Compte admin créé depuis .env si la table est vide ; échoue au démarrage plutôt
    // que de servir une API sans administrateur.
    await app.get(AuthService).garantirAdmin();

    await app.listen(env.port);
    console.log(`API prête sur le port ${env.port} (origines autorisées : ${env.originesAutorisees.join(", ")})`);
}

principal().catch((erreur) => {
    console.error("Démarrage impossible :", erreur instanceof Error ? erreur.message : erreur);
    process.exitCode = 1;
});
