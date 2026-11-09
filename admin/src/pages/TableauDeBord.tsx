import { useCallback, useEffect, useState } from "react";
import { Eye, EyeOff, ImageIcon, LogOut, Pencil, Plus, RefreshCw, Trash2 } from "lucide-react";
import {
    creerProjet,
    listerProjets,
    modifierProjet,
    resoudreImage,
    supprimerProjet,
    type BrouillonProjet,
    type Projet,
} from "../api";
import { useAuth } from "../auth";
import ChargementPage from "../composants/ChargementPage";
import FormulaireProjet from "../composants/FormulaireProjet";

type Edition = { ouvert: false } | { ouvert: true; projet: Projet | null };

const TableauDeBord = () => {
    const { email, deconnexion } = useAuth();
    const [projets, setProjets] = useState<Projet[]>([]);
    const [chargement, setChargement] = useState(true);
    const [message, setMessage] = useState<string | null>(null);
    const [edition, setEdition] = useState<Edition>({ ouvert: false });
    const [enCours, setEnCours] = useState<string | null>(null);

    const charger = useCallback(async () => {
        setChargement(true);
        setMessage(null);
        try {
            setProjets(await listerProjets());
        } catch (e) {
            setMessage(e instanceof Error ? e.message : "Chargement impossible");
        } finally {
            setChargement(false);
        }
    }, []);

    useEffect(() => {
        void charger();
    }, [charger]);

    const enregistrer = async (brouillon: BrouillonProjet) => {
        if (edition.ouvert && edition.projet) await modifierProjet(edition.projet.id, brouillon);
        else await creerProjet(brouillon);
        setEdition({ ouvert: false });
        await charger();
    };

    const basculerPublication = async (projet: Projet) => {
        setEnCours(projet.id);
        setMessage(null);
        try {
            await modifierProjet(projet.id, { publie: !projet.publie });
            setProjets((liste) => liste.map((p) => (p.id === projet.id ? { ...p, publie: !projet.publie } : p)));
        } catch (e) {
            setMessage(e instanceof Error ? e.message : "Mise à jour impossible");
        } finally {
            setEnCours(null);
        }
    };

    const supprimer = async (projet: Projet) => {
        // Confirmation explicite : la suppression est définitive côté base.
        if (!window.confirm(`Supprimer « ${projet.sousTitre} » du portfolio ?`)) return;
        setEnCours(projet.id);
        setMessage(null);
        try {
            await supprimerProjet(projet.id);
            setProjets((liste) => liste.filter((p) => p.id !== projet.id));
        } catch (e) {
            setMessage(e instanceof Error ? e.message : "Suppression impossible");
        } finally {
            setEnCours(null);
        }
    };

    const publies = projets.filter((projet) => projet.publie).length;
    const chargementInitial = chargement && projets.length === 0;

    return (
        <div className="min-h-screen bg-abyss px-4 py-8 sm:px-8">
            <ChargementPage visible={chargementInitial} message="Chargement des projets…" />
            <header className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 border-b border-ice/10 pb-6">
                <div>
                    <p className="font-serif text-sky text-sm">Portfolio — administration</p>
                    <h1 className="font-serif font-extrabold text-ice text-3xl sm:text-4xl">Projets</h1>
                    <p className="mt-1 text-ice/60 text-sm">
                        {chargement ? "Chargement…" : `${projets.length} projet(s) en base · ${publies} publié(s) sur le site`}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="hidden text-ice/60 text-sm sm:inline">{email}</span>
                    <button onClick={() => void charger()} className="cursor-pointer rounded-full border border-ice/25 p-2.5 text-ice transition-colors hover:border-sky hover:text-sky" aria-label="Recharger la liste">
                        <RefreshCw size={16} />
                    </button>
                    <button onClick={deconnexion} className="flex cursor-pointer items-center gap-2 rounded-full border border-ice/25 px-4 py-2 text-ice transition-colors hover:border-sky hover:text-sky">
                        <LogOut size={16} /> DÉCONNEXION
                    </button>
                </div>
            </header>

            <div className="mx-auto max-w-5xl">
                {message && (
                    <p className="mt-6 rounded-lg border border-sky/40 bg-deep/50 px-4 py-3 text-ice text-sm" role="alert">
                        {message}
                    </p>
                )}

                <button
                    onClick={() => setEdition({ ouvert: true, projet: null })}
                    className="mt-6 flex cursor-pointer items-center gap-2 rounded-full bg-sky px-5 py-2.5 font-serif font-bold text-abyss transition-colors hover:bg-ice"
                >
                    <Plus size={18} /> AJOUTER UN PROJET
                </button>

                <ul className="mt-6 flex flex-col gap-3 pb-16">
                    {projets.map((projet) => (
                        <li key={projet.id} className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-ice/15 bg-linear-to-b from-steel/25 to-deep/40 p-4">
                            <div className="flex min-w-0 flex-1 items-center gap-4">
                                <div className="flex h-12 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-ice/10 bg-abyss/50 sm:h-14 sm:w-20">
                                    {resoudreImage(projet.image) ? (
                                        <img src={resoudreImage(projet.image)!} alt="" loading="lazy" className="h-full w-full object-cover" />
                                    ) : (
                                        <ImageIcon size={20} className="text-ice/30" />
                                    )}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="rounded-full bg-abyss/50 px-2 py-0.5 text-ice/70 text-xs">#{projet.ordre}</span>
                                        <span className="text-sky/90 text-sm">{projet.titre}</span>
                                        <span className="text-ice/40 text-xs">· {projet.categorie} · {projet.annee}</span>
                                        {!projet.publie && <span className="rounded-full border border-ice/25 px-2 py-0.5 text-ice/60 text-xs">brouillon</span>}
                                    </div>
                                    <h2 className="truncate font-serif font-bold text-ice">{projet.sousTitre}</h2>
                                    <p className="mt-1 text-ice/60 text-xs">{projet.stack.join(" · ")}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => void basculerPublication(projet)}
                                    disabled={enCours === projet.id}
                                    aria-label={projet.publie ? "Dépublier" : "Publier"}
                                    className="cursor-pointer rounded-full bg-ice/10 p-2.5 text-ice transition-colors hover:bg-sky hover:text-abyss disabled:cursor-wait"
                                >
                                    {projet.publie ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                                <button
                                    onClick={() => setEdition({ ouvert: true, projet })}
                                    aria-label="Modifier"
                                    className="cursor-pointer rounded-full bg-ice/10 p-2.5 text-ice transition-colors hover:bg-sky hover:text-abyss"
                                >
                                    <Pencil size={16} />
                                </button>
                                <button
                                    onClick={() => void supprimer(projet)}
                                    disabled={enCours === projet.id}
                                    aria-label="Supprimer"
                                    className="cursor-pointer rounded-full bg-ice/10 p-2.5 text-ice transition-colors hover:bg-abyss hover:text-sky disabled:cursor-wait"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </li>
                    ))}

                    {!chargement && projets.length === 0 && !message && (
                        <li className="rounded-xl border border-dashed border-ice/20 p-8 text-center text-ice/60">
                            Aucun projet en base. Cliquez sur « Ajouter un projet » pour créer la première carte du portfolio.
                        </li>
                    )}
                </ul>
            </div>

            {edition.ouvert && (
                <FormulaireProjet
                    projet={edition.projet}
                    onEnregistre={enregistrer}
                    onFerme={() => setEdition({ ouvert: false })}
                />
            )}
        </div>
    );
};

export default TableauDeBord;
