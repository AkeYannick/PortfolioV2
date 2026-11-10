const IMAGES = import.meta.glob("../assets/Projets/*.{png,jpg,jpeg,webp,svg,avif}", {
    eager: true,
    import: "default",
}) as Record<string, string>;

export type CategorieApi = "WEB" | "MOBILE" | "DESIGN";
export type CleIcone = "smartphone" | "immeuble" | "cadeau";

/** Modèle utilisé par la grille : identique pour les projets du site et ceux de l'API. */
export type ProjetCarte = {
    id: string;
    titre: string;
    sous_titre: string;
    stack: string[];
    annee: string;
    image?: string;
    lien?: string;
    icone?: CleIcone;
};

type ProjetApi = {
    id: string;
    titre: string;
    sousTitre: string;
    stack: string[];
    annee: string;
    categorie: CategorieApi;
    image: string | null;
    lien: string | null;
};

const ICONES: Record<CategorieApi, CleIcone> = { MOBILE: "smartphone", WEB: "immeuble", DESIGN: "cadeau" };

const URL_API = (import.meta.env.VITE_API_URL ?? "http://localhost:3001").replace(/\/$/, "");

/**
 * `image` peut être une URL externe, un chemin /uploads servi par l'API
 * (images importées depuis le dashboard), ou un simple nom de fichier présent
 * dans client/src/assets/Projets : le fichier est alors résolu à la compilation.
 */
const resoudreImage = (image: string | null): string | undefined => {
    if (!image) return undefined;
    if (/^https?:\/\//i.test(image)) return image;
    if (image.startsWith("/uploads/")) return `${URL_API}${image}`;
    const cible = image.toLowerCase();
    const entree = Object.entries(IMAGES).find(([chemin]) => chemin.toLowerCase().endsWith(`/${cible}`));
    return entree?.[1];
};

const versCarte = (projet: ProjetApi): ProjetCarte => ({
    id: projet.id,
    titre: projet.titre,
    sous_titre: projet.sousTitre,
    stack: projet.stack,
    annee: projet.annee,
    image: resoudreImage(projet.image),
    lien: projet.lien ?? undefined,
    icone: ICONES[projet.categorie],
});

/** Renvoie null quand l'API est injoignable : la grille garde alors sa liste locale. */
export async function chargerProjets(): Promise<ProjetCarte[] | null> {
    try {
        const reponse = await fetch(`${URL_API}/projets`);
        if (!reponse.ok) throw new Error(`HTTP ${reponse.status}`);
        const donnees = (await reponse.json()) as ProjetApi[];
        return Array.isArray(donnees) ? donnees.map(versCarte) : null;
    } catch (erreur) {
        console.info("Projets servis depuis la liste locale (API indisponible).", erreur);
        return null;
    }
}
