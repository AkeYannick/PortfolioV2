import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import { hacherMotDePasse } from "../auth/password.util";
import { lireEnv } from "../env";

/**
 * Crée (ou met à jour) le compte admin du dashboard depuis .env.
 * À relancer après un changement de ADMIN_EMAIL / ADMIN_PASSWORD.
 */
async function principal() {
    const env = lireEnv();
    const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: env.databaseUrl }) });

    const hash = await hacherMotDePasse(env.adminPassword);
    const admin = await prisma.adminUser.upsert({
        where: { email: env.adminEmail },
        update: { motDePasseHash: hash },
        create: { email: env.adminEmail, motDePasseHash: hash },
    });

    console.log(`Compte admin prêt : ${admin.email}`);
    await prisma.$disconnect();
}

principal().catch((erreur) => {
    console.error("Seed impossible :", erreur instanceof Error ? erreur.message : erreur);
    process.exitCode = 1;
});
