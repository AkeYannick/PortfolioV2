import { Global, Module } from "@nestjs/common";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import { lireEnv } from "../env";

/**
 * Prisma 7 supprime le moteur Rust : un adaptateur de pilote est obligatoire.
 * Ici PrismaPg, qui convient aussi à Neon via sa chaîne « pooled ».
 */
export class PrismaService extends PrismaClient {
    constructor() {
        const env = lireEnv();
        super({ adapter: new PrismaPg({ connectionString: env.databaseUrl }) });
    }
}

@Global()
@Module({
    providers: [PrismaService],
    exports: [PrismaService],
})
export class PrismaModule {}
