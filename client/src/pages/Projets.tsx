import { Building2, Gift, MoveRight, MoveUpRight, Smartphone } from "lucide-react";
import { useEffect, useState } from "react";
import image1 from "../assets/Projets/image1.png";
import cesaimag from "../assets/Projets/cesaimag.png";
import todoimag from "../assets/Projets/todoimag.png";
import affiche_compressee_v2 from "../assets/Projets/affiche_compressee_v2.jpg";
import CarteVisite from "../assets/Projets/CarteVisite.png";
import Reveal from "../components/Reveal";
import Tilt from "../components/Tilt";
import { chargerProjets, type CleIcone, type ProjetCarte } from "../services/projets";

/** Liste de secours : affichée tant que l'API du dashboard n'est pas joignable. */
const PROJETS_LOCAUX: ProjetCarte[] = [
    {
        id: "local-boutique",
        image: image1,
        titre: "Dev — Boutique en ligne",
        sous_titre: "Donovane — Mode & Beauté",
        stack: ["React", "Vite.js", "CSS3"],
        annee: "2026",
    },
    {
        id: "local-cesa",
        image: cesaimag,
        titre: "Dev — Site institutionnel",
        sous_titre: "École COFE CESA",
        stack: ["WordPress", "PHP", "MySQL", "SEO"],
        annee: "2024 — 2025",
    },
    {
        id: "local-loyer",
        icone: "smartphone",
        titre: "Dev — Application mobile",
        sous_titre: "Paiement de loyer en ligne",
        stack: ["Flutter", "Node.js", "Express.js", "MySQL"],
        annee: "2026 — en cours",
    },
    {
        id: "local-todolist",
        image: todoimag,
        titre: "Dev — SPA React",
        sous_titre: "TodoList gestion de tâches",
        stack: ["React", "Vite.js", "JavaScript", "CSS3"],
        annee: "2025",
        lien: "https://github.com/AkeYannick",
    },
    {
        id: "local-gestion",
        icone: "immeuble",
        titre: "Dev — Application web",
        sous_titre: "Gestion locative complète",
        stack: ["React", "TypeScript", "Vite.js", "Node.js", "Express.js", "MySQL"],
        annee: "2026",
    },
    {
        id: "local-mariage",
        icone: "cadeau",
        titre: "Dev — Site interactif",
        sous_titre: "Invitation de mariage",
        stack: ["HTML5", "CSS3", "JavaScript"],
        annee: "Freelance",
    },
    {
        id: "local-affiche",
        image: affiche_compressee_v2,
        titre: "Design — Affiche",
        sous_titre: "Création graphique",
        stack: ["Canva"],
        annee: "2025",
    },
    {
        id: "local-carte",
        image: CarteVisite,
        titre: "Design — Carte de visite",
        sous_titre: "Attiéké Royal",
        stack: ["Canva"],
        annee: "2025",
    },
];

const Icone = ({ icone }: { icone?: CleIcone }) =>
    icone === "smartphone" ? <Smartphone size={44} /> : icone === "immeuble" ? <Building2 size={44} /> : <Gift size={44} />;

const Projets = () => {
    const [projets, setProjets] = useState<ProjetCarte[]>(PROJETS_LOCAUX);
    const [survol, setSurvol] = useState<string | null>(null);

    useEffect(() => {
        let abandonne = false;
        chargerProjets().then((liste) => {
            if (!abandonne && liste && liste.length > 0) setProjets(liste);
        });
        return () => {
            abandonne = true;
        };
    }, []);

    return (
        <div className="gap-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 px-4 py-10 sm:px-6 lg:p-10 lg:pt-20 scroll-offset" id="Projets">
            {projets.map((item, index) => (
                <Reveal key={item.id} delay={index * 90} variant="up" className="h-full">
                    <Tilt max={8} scale={1.03}>
                        <div className="group h-104 sm:h-120 w-full rounded-2xl bg-linear-to-b from-steel/30 to-deep/60 backdrop-blur-md border border-ice/15 text-sky flex flex-col justify-between overflow-hidden transition-shadow duration-500 hover:shadow-2xl hover:shadow-sky/20 hover:border-sky/50">
                            <div className="pt-12 sm:pt-16 p-5 flex justify-center items-center overflow-hidden">
                                {item.image ? (
                                    <img
                                        src={item.image}
                                        width={250}
                                        alt={item.sous_titre}
                                        loading="lazy"
                                        className="max-w-full max-h-48 sm:max-h-56 h-auto object-contain rounded-lg drop-shadow-[0_18px_24px_rgba(0,29,57,0.55)] transition-transform duration-500 ease-out group-hover:scale-110"
                                        style={{ transform: "translateZ(45px)" }}
                                    />
                                ) : (
                                    <div
                                        className="flex h-44 w-44 sm:h-52 sm:w-52 flex-col items-center justify-center gap-3 rounded-2xl border border-sky/40 bg-linear-to-br from-deep/70 to-teal/40 text-sky transition-transform duration-500 group-hover:scale-110"
                                        style={{ transform: "translateZ(45px)" }}
                                        aria-label={item.sous_titre}
                                    >
                                        <Icone icone={item.icone} />
                                        <span className="px-4 text-center font-serif text-sm font-bold text-ice/80">{item.sous_titre}</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-between items-end gap-3 p-5" style={{ transform: "translateZ(30px)" }}>
                                <div className="min-w-0 transition-transform duration-300 group-hover:translate-x-1">
                                    <span className="text-sky/80 text-sm">{item.titre} — {item.annee}</span>
                                    <h2 className="text-ice font-bold font-serif leading-snug">{item.sous_titre}</h2>
                                    <ul className="mt-2 flex flex-wrap gap-1.5 list-none">
                                        {item.stack.map((tech) => (
                                            <li key={tech} className="rounded-full border border-ice/15 bg-abyss/40 px-2 py-0.5 text-ice/70 text-xs whitespace-nowrap">
                                                {tech}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {item.lien ? (
                                    <a href={item.lien} target="_blank" rel="noopener noreferrer" aria-label={`Voir le code de ${item.sous_titre}`}>
                                        <button
                                            onMouseEnter={() => setSurvol(item.id)}
                                            onMouseLeave={() => setSurvol(null)}
                                            className="bg-ice/10 rounded-4xl py-3 px-3 hover:bg-sky duration-300 ease-in-out transition-all cursor-pointer hover:scale-110 hover:rotate-45"
                                        >
                                            {survol === item.id ? <MoveRight color="#001D39" /> : <MoveUpRight color="#BDD8E9" />}
                                        </button>
                                    </a>
                                ) : (
                                    <button
                                        onMouseEnter={() => setSurvol(item.id)}
                                        onMouseLeave={() => setSurvol(null)}
                                        className="bg-ice/10 rounded-4xl py-3 px-3 hover:bg-sky duration-300 ease-in-out transition-all cursor-pointer hover:scale-110 hover:rotate-45"
                                        aria-label={item.sous_titre}
                                    >
                                        {survol === item.id ? <MoveRight color="#001D39" /> : <MoveUpRight color="#BDD8E9" />}
                                    </button>
                                )}
                            </div>
                        </div>
                    </Tilt>
                </Reveal>
            ))}
        </div>
    );
};

export default Projets;
