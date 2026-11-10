import { Briefcase, Dot, GraduationCap } from "lucide-react";
import Reveal from "../components/Reveal";
import Tilt from "../components/Tilt";

const COMPETENCES = [
    { groupe: "Frontend", items: ["HTML5 / CSS3", "JavaScript (ES6+)", "TypeScript", "React.js / Vite.js"] },
    { groupe: "Mobile", items: ["Flutter (Android / iOS)"] },
    { groupe: "Backend", items: ["PHP", "Node.js", "Express.js", "MySQL"] },
    { groupe: "CMS & Outils", items: ["WordPress", "VS Code", "XAMPP", "Canva"] },
    { groupe: "Collaboration", items: ["Git / GitHub"] },
];

const PARCOURS = [
    {
        annee: "2024 — 2025",
        titre: "Développeur Web — Groupe COFE CESA",
        description: "Conception et développement du site institutionnel de l'école COFE CESA : wireframe, design, intégration WordPress et back-office fonctionnel, optimisation SEO. Site en production utilisé par l'administration.",
        type: "exp" as const,
    },
    {
        annee: "Freelance",
        titre: "Site web interactif d'invitation de mariage",
        description: "Présentation du couple et gestion des invités, avec formulaire de confirmation dynamique et validation JavaScript côté client.",
        type: "exp" as const,
    },
    {
        annee: "2023 — 2024",
        titre: "Licence Pro Réseaux & Génie Logiciel",
        description: "Groupe COFE CESA, Abidjan.",
        type: "formation" as const,
    },
    {
        annee: "2022 — 2023",
        titre: "BTS Informatique — Dev. d'applications",
        description: "NBA Business School, Abidjan.",
        type: "formation" as const,
    },
    {
        annee: "2020 — 2021",
        titre: "Baccalauréat Série D",
        description: "Groupe Scolaire Miri de Bingerville.",
        type: "formation" as const,
    },
];

const CompetencesParcours = () => {
    return (
        <div className="py-12 px-4 sm:px-6 lg:py-20 lg:p-10 scroll-offset" id="Parcours">
            <Reveal>
                <span className="flex items-center text-sky"><Dot color="#7BBDE8" size={50} className="animate-pulse" />MON EXPERTISE</span>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-ice">Des compétences solides, un parcours concret.</h2>
            </Reveal><br />

            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-10 lg:gap-14">
                {/* Colonne compétences */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 content-start">
                    {COMPETENCES.map((c, i) => (
                        <Reveal key={c.groupe} delay={i * 90} variant="up" className="h-full">
                            <Tilt max={8}>
                                <div className="h-full rounded-2xl bg-linear-to-b from-steel/30 to-deep/60 backdrop-blur-md border border-ice/15 p-5 transition-all duration-500 hover:border-sky/50 hover:shadow-xl hover:shadow-sky/15">
                                    <p className="font-serif font-bold text-sky mb-3">{c.groupe}</p>
                                    <ul className="list-none flex flex-wrap gap-2">
                                        {c.items.map((item) => (
                                            <li key={item} className="text-ice/80 text-sm bg-abyss/40 border border-ice/10 rounded-full px-3 py-1">
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </Tilt>
                        </Reveal>
                    ))}

                    <Reveal delay={COMPETENCES.length * 90} variant="up" className="sm:col-span-2">
                        <div className="rounded-2xl bg-linear-to-b from-steel/30 to-deep/60 backdrop-blur-md border border-ice/15 p-5 flex flex-wrap items-center gap-x-8 gap-y-2">
                            <p className="font-serif font-bold text-sky">Langues</p>
                            <span className="text-ice/80">Français — courant</span>
                            <span className="text-ice/80">Anglais — A2</span>
                        </div>
                    </Reveal>
                </div>

                {/* Colonne parcours (timeline) */}
                <div className="flex flex-col gap-6">
                    {PARCOURS.map((p, i) => (
                        <Reveal key={p.titre} delay={i * 80} variant="right">
                            <div className="flex gap-4 sm:gap-6">
                                <div className="flex flex-col items-center">
                                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky/15 border border-sky/40 text-sky">
                                        {p.type === "exp" ? <Briefcase size={18} /> : <GraduationCap size={18} />}
                                    </span>
                                    {i < PARCOURS.length - 1 && <span className="mt-2 w-px flex-1 bg-ice/15" />}
                                </div>
                                <div className="pb-2">
                                    <span className="text-sky font-serif text-sm">{p.annee}</span>
                                    <h3 className="text-ice font-bold font-serif text-lg leading-snug">{p.titre}</h3>
                                    <p className="text-ice/70">{p.description}</p>
                                </div>
                            </div>
                        </Reveal>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CompetencesParcours;
