export const API_URL = (import.meta.env.VITE_API_URL ?? "http://localhost:3001").replace(/\/$/, "");

export const CATEGORIES = ["WEB", "MOBILE", "DESIGN"] as const;
export type Categorie = (typeof CATEGORIES)[number];

export type Projet = {
    id: string;
    titre: string;
    sousTitre: string;
    description: string | null;
    stack: string[];
    annee: string;
    categorie: Categorie;
    image: string | null;
    lien: string | null;
    publie: boolean;
    ordre: number;
    createdAt: string;
    updatedAt: string;
};

/** Ce que le backend accepte à l'écriture : le formulaire n'envoie que ces champs. */
export type BrouillonProjet = {
    titre: string;
    sousTitre: string;
    description?: string;
    stack: string[];
    annee: string;
    categorie: Categorie;
    image?: string;
    lien?: string;
    publie: boolean;
    ordre: number;
};

const CLE_JETON = "portfolio.admin.jeton";

export const lireJeton = (): string | null => sessionStorage.getItem(CLE_JETON);
export const memoriserJeton = (jeton: string) => sessionStorage.setItem(CLE_JETON, jeton);
export const oublierJeton = () => sessionStorage.removeItem(CLE_JETON);

export class ErreurApi extends Error {
    constructor(
        readonly statut: number,
        message: string,
    ) {
        super(message);
        this.name = "ErreurApi";
    }
}

async function demander<T>(chemin: string, init: RequestInit = {}): Promise<T> {
    const jeton = lireJeton();
    const reponse = await fetch(`${API_URL}${chemin}`, {
        ...init,
        headers: {
            ...(init.body ? { "content-type": "application/json" } : {}),
            ...(jeton ? { authorization: `Bearer ${jeton}` } : {}),
        },
    });

    // Le jeton a expiré (15 min) : on vide la session, l'interface renvoie vers la connexion.
    if (reponse.status === 401) oublierJeton();

    if (!reponse.ok) {
        const corps = (await reponse.json().catch(() => null)) as { message?: string | string[] } | null;
        const detail = corps?.message;
        const message =
            typeof detail === "string" ? detail : Array.isArray(detail) ? detail.join(", ") : `Erreur ${reponse.status}`;
        throw new ErreurApi(reponse.status, message);
    }

    return (await reponse.json()) as T;
}

export const connexion = async (email: string, motDePasse: string) => {
    const session = await demander<{ token: string; email: string }>("/auth/connexion", {
        method: "POST",
        body: JSON.stringify({ email, motDePasse }),
    });
    memoriserJeton(session.token);
    return session;
};

export const verifierSession = () => demander<{ id: string; email: string }>("/auth/moi");

export const listerProjets = () => demander<Projet[]>("/projets/admin/tous");

export const creerProjet = (brouillon: BrouillonProjet) =>
    demander<Projet>("/projets", { method: "POST", body: JSON.stringify(brouillon) });

export const modifierProjet = (id: string, patch: Partial<BrouillonProjet>) =>
    demander<Projet>(`/projets/${id}`, { method: "PATCH", body: JSON.stringify(patch) });

export const supprimerProjet = (id: string) => demander<{ id: string; supprime: boolean }>(`/projets/${id}`, { method: "DELETE" });

export const TAILLE_MAX_IMAGE = 10 * 1024 * 1024;
export const TYPES_IMAGE_ACCEPTES = ["image/png", "image/jpeg", "image/webp", "image/avif", "image/gif"] as const;

export type ImageTeleversee = { url: string; nom: string; taille: number; type: string };

/**
 * URL affichable dans l'admin : les chemins /uploads sont servis par l'API.
 * Un simple nom de fichier (asset local du site public) n'est pas résoluble ici.
 */
export const resoudreImage = (image: string | null | undefined): string | null => {
    if (!image) return null;
    if (/^https?:\/\//i.test(image)) return image;
    if (image.startsWith("/")) return `${API_URL}${image}`;
    return null;
};

/** Upload multipart avec progression et annulation (fetch ne donne pas la progression d'envoi). */
export const televerserImage = (
    fichier: File,
    options: { signal?: AbortSignal; surProgression?: (pourcentage: number) => void } = {},
): Promise<ImageTeleversee> =>
    new Promise((resolve, reject) => {
        if (options.signal?.aborted) {
            reject(new DOMException("Téléversement annulé", "AbortError"));
            return;
        }
        const requete = new XMLHttpRequest();
        requete.open("POST", `${API_URL}/uploads/images`);
        requete.responseType = "json";
        const jeton = lireJeton();
        if (jeton) requete.setRequestHeader("authorization", `Bearer ${jeton}`);

        requete.upload.onprogress = (evenement) => {
            if (evenement.lengthComputable) {
                options.surProgression?.(Math.round((evenement.loaded / evenement.total) * 100));
            }
        };
        requete.onload = () => {
            if (requete.status === 401) oublierJeton();
            if (requete.status >= 200 && requete.status < 300) {
                resolve(requete.response as ImageTeleversee);
                return;
            }
            const detail = (requete.response as { message?: string | string[] } | null)?.message;
            const message =
                typeof detail === "string" ? detail : Array.isArray(detail) ? detail.join(", ") : `Erreur ${requete.status}`;
            reject(new ErreurApi(requete.status, message));
        };
        requete.onerror = () => reject(new ErreurApi(0, "API injoignable : vérifiez que le backend est démarré"));
        requete.onabort = () => reject(new DOMException("Téléversement annulé", "AbortError"));
        options.signal?.addEventListener("abort", () => requete.abort(), { once: true });

        const corps = new FormData();
        corps.append("fichier", fichier);
        requete.send(corps);
    });
