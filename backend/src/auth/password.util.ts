import { randomBytes, scrypt, timingSafeEqual, type ScryptOptions } from "node:crypto";
import { promisify } from "node:util";

// promisify ne retient que la surcharge sans options de crypto.scrypt : la signature
// complète est redéclarée ici.
const scryptAsync = promisify(scrypt) as unknown as (
    clair: string,
    sel: Buffer,
    longueur: number,
    options: ScryptOptions,
) => Promise<Buffer>;

const COUT = { N: 2 ** 15, r: 8, p: 1 } as const;
const LONGUEUR_CLE = 32;

// Node plafonne scrypt à 32 Mo par défaut. Avec N=2^15 et r=8, il faut ~32 Mo + marge,
// d'où l'erreur "memory limit exceeded". On relève la limite proportionnellement à N et r.
function memoireMax(N: number, r: number): number {
    return 128 * N * r * 2;
}

/**
 * Hachage scrypt (natif à Node) plutôt que bcrypt/argon2 : aucune dépendance
 * compilée, donc installation fiable sous Windows, et un sel aléatoire par mot de passe.
 * Format stocké : scrypt$N$r$p$saltHex$hashHex
 */
export async function hacherMotDePasse(clair: string): Promise<string> {
    const sel = randomBytes(16);
    const cle = await scryptAsync(clair, sel, LONGUEUR_CLE, {
        ...COUT,
        maxmem: memoireMax(COUT.N, COUT.r),
    });
    return `scrypt$${COUT.N}$${COUT.r}$${COUT.p}$${sel.toString("hex")}$${cle.toString("hex")}`;
}

export async function verifierMotDePasse(clair: string, stocke: string): Promise<boolean> {
    const morceaux = stocke.split("$");
    if (morceaux.length !== 6 || morceaux[0] !== "scrypt") return false;
    const [, n, r, p, selHex, hashHex] = morceaux;
    const sel = Buffer.from(selHex, "hex");
    const attendu = Buffer.from(hashHex, "hex");
    const cle = await scryptAsync(clair, sel, attendu.length, {
        N: Number(n),
        r: Number(r),
        p: Number(p),
        maxmem: memoireMax(Number(n), Number(r)),
    });
    return cle.length === attendu.length && timingSafeEqual(cle, attendu);
}