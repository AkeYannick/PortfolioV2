import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

/**
 * Le CLI Prisma 7 ne charge plus .env tout seul (le moteur Rust a été retiré) :
 * ce module est importé en tout premier par prisma.config.ts et le script de seed.
 */
function chargerDotenv() {
    for (const fichier of [".env.local", ".env"]) {
        const chemin = resolve(process.cwd(), fichier);
        if (!existsSync(chemin)) continue;
        for (const ligne of readFileSync(chemin, "utf8").split(/\r?\n/)) {
            const m = /^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/.exec(ligne);
            if (!m) continue;
            const valeur = m[2].replace(/^"(.*)"$/, "$1");
            if (process.env[m[1]] === undefined) process.env[m[1]] = valeur;
        }
    }
}

chargerDotenv();

const exiger = (nom: string): string => {
    const valeur = process.env[nom];
    if (!valeur || valeur.trim() === "") {
        throw new Error(`Variable d'environnement manquante : ${nom} (voir backend/.env.example)`);
    }
    return valeur;
};

/** Valeurs livrées avec le dépôt : jamais acceptées en production. */
const PLACEHOLDERS = new Set(["changez-moi", "a-changer", "remplacez-moi"]);

export type Env = {
    port: number;
    databaseUrl: string;
    jwtSecret: string;
    jwtTtl: string;
    adminEmail: string;
    adminPassword: string;
    originesAutorisees: string[];
    estProduction: boolean;
    dossierUploads: string;
};

export const lireEnv = (): Env => {
    const estProduction = process.env.NODE_ENV === "production";

    const secret = exiger("JWT_SECRET");
    if (estProduction && (PLACEHOLDERS.has(secret) || secret.length < 32)) {
        throw new Error("JWT_SECRET doit faire au moins 32 caractères en production et ne pas être une valeur d'exemple.");
    }

    const url = exiger("DATABASE_URL");
    if (estProduction && url.startsWith("postgresql://") && !url.includes("sslmode=require")) {
        throw new Error("DATABASE_URL doit forcer TLS (mode pooled + sslmode=require) en production.");
    }

    const origines = (process.env.CORS_ORIGINES ?? "http://localhost:5175,http://localhost:5173")
        .split(",")
        .map((o) => o.trim().replace(/\/$/, ""))
        .filter(Boolean);

    const ttl = (process.env.JWT_TTL ?? "").trim() || "15m";
    if (!/^\d+(s|m|h|d)$/.test(ttl)) {
        throw new Error(`JWT_TTL invalide : ${ttl} (format attendu : 15m, 8h, 30s, 1d).`);
    }

    return {
        port: Number(process.env.PORT ?? 3001),
        databaseUrl: url,
        jwtSecret: secret,
        jwtTtl: ttl,
        adminEmail: exiger("ADMIN_EMAIL").toLowerCase(),
        adminPassword: exiger("ADMIN_PASSWORD"),
        originesAutorisees: origines,
        estProduction,
        dossierUploads: resolve(process.cwd(), process.env.DOSSIER_UPLOADS?.trim() || "uploads"),
    };
};
