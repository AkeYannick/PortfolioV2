import { useState, type FormEvent, type ReactNode } from "react";
import { X } from "lucide-react";
import { CATEGORIES, type BrouillonProjet, type Categorie, type Projet } from "../api";
import ChampImage from "./ChampImage";

type Props = {
    projet: Projet | null;
    onEnregistre: (brouillon: BrouillonProjet) => Promise<void>;
    onFerme: () => void;
};

const LibelleCategorie: Record<Categorie, string> = { WEB: "Web", MOBILE: "Mobile", DESIGN: "Design" };

/** Valeurs du formulaire : la stack reste une liste saisie en une ligne, séparée par des virgules. */
const initial = (projet: Projet | null) => ({
    titre: projet?.titre ?? "",
    sousTitre: projet?.sousTitre ?? "",
    description: projet?.description ?? "",
    stack: projet?.stack.join(", ") ?? "",
    annee: projet?.annee ?? String(new Date().getFullYear()),
    categorie: (projet?.categorie ?? "WEB") as Categorie,
    image: projet?.image ?? "",
    lien: projet?.lien ?? "",
    ordre: projet?.ordre ?? 0,
    publie: projet?.publie ?? true,
});

const Champ = ({ label, children }: { label: string; children: ReactNode }) => (
    <label className="flex flex-col gap-1">
        <span className="text-sky text-sm">{label}</span>
        {children}
    </label>
);

const FormulaireProjet = ({ projet, onEnregistre, onFerme }: Props) => {
    const [valeurs, setValeurs] = useState(() => initial(projet));
    const [envoi, setEnvoi] = useState(false);
    const [imageEnCours, setImageEnCours] = useState(false);
    const [erreur, setErreur] = useState<string | null>(null);

    const maj = <K extends keyof typeof valeurs>(cle: K, valeur: (typeof valeurs)[K]) =>
        setValeurs((precedentes) => ({ ...precedentes, [cle]: valeur }));

    const soumettre = async (evenement: FormEvent) => {
        evenement.preventDefault();
        setEnvoi(true);
        setErreur(null);
        try {
            await onEnregistre({
                titre: valeurs.titre.trim(),
                sousTitre: valeurs.sousTitre.trim(),
                description: valeurs.description.trim() || undefined,
                stack: valeurs.stack
                    .split(",")
                    .map((tech) => tech.trim())
                    .filter(Boolean),
                annee: valeurs.annee.trim(),
                categorie: valeurs.categorie,
                image: valeurs.image.trim() || undefined,
                lien: valeurs.lien.trim() || undefined,
                ordre: valeurs.ordre,
                publie: valeurs.publie,
            });
        } catch (e) {
            setErreur(e instanceof Error ? e.message : "Enregistrement impossible");
        } finally {
            setEnvoi(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-abyss/80 px-4 py-8 backdrop-blur-sm">
            <form
                onSubmit={soumettre}
                className="w-full max-w-2xl rounded-2xl border border-ice/15 bg-linear-to-b from-steel/30 to-deep/60 p-6 sm:p-8"
            >
                <div className="mb-6 flex items-start justify-between gap-4">
                    <h2 className="font-serif font-bold text-ice text-2xl">{projet ? "Modifier le projet" : "Nouveau projet"}</h2>
                    <button
                        type="button"
                        onClick={onFerme}
                        aria-label="Fermer"
                        className="cursor-pointer rounded-full bg-ice/10 p-2 text-ice transition-colors hover:bg-sky hover:text-abyss"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                    <Champ label="Titre principal *">
                        <input className="champ" required minLength={2} maxLength={120} value={valeurs.titre} onChange={(e) => maj("titre", e.target.value)} placeholder="Dev — Application mobile" />
                    </Champ>
                    <Champ label="Sous-titre *">
                        <input className="champ" required minLength={2} maxLength={120} value={valeurs.sousTitre} onChange={(e) => maj("sousTitre", e.target.value)} placeholder="Paiement de loyer en ligne" />
                    </Champ>

                    <div className="sm:col-span-2">
                        <Champ label="Description">
                            <textarea className="champ min-h-24 resize-y" maxLength={2000} value={valeurs.description} onChange={(e) => maj("description", e.target.value)} placeholder="Ce que fait le projet, votre rôle, les résultats…" />
                        </Champ>
                    </div>

                    <Champ label="Stack * (séparé par des virgules)">
                        <input className="champ" required value={valeurs.stack} onChange={(e) => maj("stack", e.target.value)} placeholder="Flutter, Node.js, MySQL" />
                    </Champ>
                    <Champ label="Année *">
                        <input className="champ" required minLength={2} maxLength={40} value={valeurs.annee} onChange={(e) => maj("annee", e.target.value)} placeholder="2026 — en cours" />
                    </Champ>

                    <Champ label="Catégorie">
                        <select className="champ cursor-pointer" value={valeurs.categorie} onChange={(e) => maj("categorie", e.target.value as Categorie)}>
                            {CATEGORIES.map((categorie) => (
                                <option key={categorie} value={categorie} className="bg-abyss">
                                    {LibelleCategorie[categorie]}
                                </option>
                            ))}
                        </select>
                    </Champ>
                    <Champ label="Ordre d'affichage">
                        <input className="champ" type="number" min={0} max={9999} step={1} value={valeurs.ordre} onChange={(e) => maj("ordre", Number(e.target.value))} />
                    </Champ>

                    <div className="sm:col-span-2">
                        <ChampImage valeur={valeurs.image} onChange={(valeur) => maj("image", valeur)} onTeleversement={setImageEnCours} />
                    </div>
                    <div className="sm:col-span-2">
                        <Champ label="Lien (GitHub, démo…)">
                            <input className="champ" maxLength={500} value={valeurs.lien} onChange={(e) => maj("lien", e.target.value)} placeholder="https://github.com/AkeYannick" />
                        </Champ>
                    </div>
                </div>

                <label className="mt-6 flex cursor-pointer items-center gap-3 text-ice/80 text-sm">
                    <input type="checkbox" className="h-4 w-4 cursor-pointer accent-sky" checked={valeurs.publie} onChange={(e) => maj("publie", e.target.checked)} />
                    Publier sur le site public
                </label>

                {erreur && (
                    <p className="mt-6 rounded-lg border border-sky/40 bg-deep/50 px-3 py-2 text-sm text-ice" role="alert">
                        {erreur}
                    </p>
                )}

                <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                    <button type="button" onClick={onFerme} className="cursor-pointer rounded-full border border-ice/25 px-6 py-2.5 text-ice transition-colors hover:border-sky hover:text-sky">
                        ANNULER
                    </button>
                    <button type="submit" disabled={envoi || imageEnCours} className="cursor-pointer rounded-full bg-sky px-6 py-2.5 font-serif font-bold text-abyss transition-colors hover:bg-ice disabled:cursor-wait disabled:opacity-60">
                        {imageEnCours ? "IMAGE EN COURS…" : envoi ? "ENREGISTREMENT…" : "ENREGISTRER"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default FormulaireProjet;
