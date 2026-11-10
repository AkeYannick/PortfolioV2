import { useEffect, useRef, useState } from "react";
import image_enhanced from "../assets/image_enhanced.png";
import Scene3D from "../components/Scene3D";

type DemarrageProps = {
    /** Appelé quand le rideau commence à se lever : on peut monter le site derrière. */
    onExitStart?: () => void;
    /** Appelé quand l'animation de sortie est terminée : on peut retirer le splash. */
    onFinish: () => void;
};

// Mêmes 4 métiers que dans le Hero / Services : la page de chargement les "présente".
const ETAPES = [
    { numero: "01", titre: "Développement Web" },
    { numero: "02", titre: "Développement Mobile" },
    { numero: "03", titre: "Création d'Affiches" },
    { numero: "04", titre: "Retouche Photoshop" },
];

const LOGO = ["A", "K", "E", ".", "D", "e", "v"];

const DUREE_MIN = 2800; // durée minimale d'affichage (ms)
const DUREE_MIN_REDUITE = 700; // si l'utilisateur préfère moins d'animations
const PAUSE_A_100 = 350; // petite pause sur 100% avant de lever le rideau
const DUREE_SORTIE = 1250; // durée totale de l'animation de sortie

const DemarragePage = ({ onExitStart, onFinish }: DemarrageProps) => {
    const [progress, setProgress] = useState(0);
    const [exiting, setExiting] = useState(false);
    const [reduit] = useState(
        () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
    const readyRef = useRef(false);

    // Bloque le scroll de la page tant que le splash est affiché.
    useEffect(() => {
        const previous = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        window.scrollTo(0, 0);
        return () => {
            document.body.style.overflow = previous;
        };
    }, []);

    // Précharge l'image du hero + attend la fin du chargement de la page :
    // la barre ne dépasse pas 92% tant que ce n'est pas prêt.
    useEffect(() => {
        let cancelled = false;

        const image = new Promise<void>((resolve) => {
            const img = new Image();
            img.onload = () => resolve();
            img.onerror = () => resolve();
            img.src = image_enhanced;
        });

        const page = new Promise<void>((resolve) => {
            if (document.readyState === "complete") resolve();
            else window.addEventListener("load", () => resolve(), { once: true });
        });

        Promise.all([image, page]).then(() => {
            if (!cancelled) readyRef.current = true;
        });

        return () => {
            cancelled = true;
        };
    }, []);

    // Animation de la progression (requestAnimationFrame).
    useEffect(() => {
        const duree = reduit ? DUREE_MIN_REDUITE : DUREE_MIN;
        const start = performance.now();
        let raf = 0;

        const tick = (now: number) => {
            const t = Math.min((now - start) / duree, 1);
            const eased = 1 - Math.pow(1 - t, 2);
            const plafond = readyRef.current ? 100 : 92;
            const valeur = Math.min(eased * 100, plafond);

            setProgress((prev) => Math.max(prev, valeur));

            if (valeur < 100) raf = requestAnimationFrame(tick);
        };

        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [reduit]);

    // À 100% : courte pause puis sortie.
    useEffect(() => {
        if (progress < 100 || exiting) return;
        const id = window.setTimeout(() => {
            setExiting(true);
            onExitStart?.();
        }, reduit ? 0 : PAUSE_A_100);
        return () => window.clearTimeout(id);
    }, [progress, exiting, reduit, onExitStart]);

    // Une fois le rideau levé : on prévient le parent pour retirer le splash.
    useEffect(() => {
        if (!exiting) return;
        const id = window.setTimeout(onFinish, reduit ? 0 : DUREE_SORTIE);
        return () => window.clearTimeout(id);
    }, [exiting, reduit, onFinish]);

    const pourcentage = Math.round(progress);
    const etapeActive = Math.min(ETAPES.length - 1, Math.floor(progress / (100 / ETAPES.length)));

    const rideau = "transition-[transform,border-radius] duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none";

    return (
        <div className="fixed inset-0 z-100" role="status" aria-live="polite" aria-busy={!exiting}>
            <span className="sr-only">Chargement du portfolio AKE.Dev : {pourcentage}%</span>

            {/* Rideau glacier (dessous) : apparaît une fraction de seconde quand l'abyss se lève */}
            <div
                aria-hidden="true"
                className={`absolute inset-0 bg-linear-to-br from-sky to-teal ${rideau} ${
                    exiting ? "-translate-y-full rounded-b-4xl" : "translate-y-0 rounded-b-none"
                }`}
                style={{ transitionDelay: exiting && !reduit ? "160ms" : "0ms" }}
            />

            {/* Rideau abyss (dessus) : contient toute la page de chargement */}
            <div
                className={`absolute inset-0 flex flex-col overflow-hidden bg-abyss ${rideau} ${
                    exiting ? "-translate-y-full rounded-b-4xl" : "translate-y-0 rounded-b-none"
                }`}
            >
                {/* Halo bleu en fond */}
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute left-1/2 top-1/2 h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky/20 blur-3xl animate-pulse"
                />

                {/* Barre du haut */}
                <div className="relative flex items-center justify-between px-5 pt-6 font-serif text-xs text-ice/40 sm:px-10 sm:pt-8 sm:text-sm animate-fade-in">
                    <span>Portfolio 2026</span>
                    <span>Abidjan, CI</span>
                </div>

                {/* Centre : globe 3D connecté + logo */}
                <div className="relative flex flex-1 flex-col items-center justify-center gap-6 px-5 text-center">
                    <Scene3D
                        className="w-56 h-56 sm:w-72 sm:h-72 animate-fade-in"
                    />

                    

                    <h1 className="flex font-serif text-6xl font-bold tracking-tight text-ice sm:text-8xl lg:text-9xl">
                        {LOGO.map((lettre, i) => (
                            <span
                                key={i}
                                className="inline-block animate-fade-in-up"
                                style={{ animationDelay: `${250 + i * 90}ms` }}
                            >
                                {lettre === "." ? (
                                    <span className="inline-block text-sky animate-pulse">.</span>
                                ) : (
                                    lettre
                                )}
                            </span>
                        ))}
                    </h1>

                    <p
                        className="font-serif text-base text-ice/50 sm:text-xl animate-fade-in-up"
                        style={{ animationDelay: "1000ms" }}
                    >
                        Développeur & Designer
                    </p>
                </div>

                {/* Bas : métiers + compteur */}
                <div className="relative flex items-end justify-between gap-6 px-5 pb-6 sm:px-10 sm:pb-8">
                    <ul className="flex flex-col gap-1.5 font-serif text-sm sm:text-base">
                        {ETAPES.map((etape, i) => {
                            const atteinte = i <= etapeActive;
                            const active = i === etapeActive;
                            return (
                                <li
                                    key={etape.numero}
                                    className={`flex items-center gap-3 transition-colors duration-300 ${
                                        active ? "text-ice" : atteinte ? "text-ice/40" : "text-ice/20"
                                    }`}
                                >
                                    <span className={`transition-colors duration-300 ${atteinte ? "text-sky" : "text-ice/30"}`}>
                                        {etape.numero}
                                    </span>
                                    {etape.titre}
                                </li>
                            );
                        })}
                    </ul>

                    <span className="font-serif text-6xl font-bold leading-none tabular-nums text-ice sm:text-8xl">
                        {pourcentage}
                        <span className="text-2xl text-sky sm:text-4xl">%</span>
                    </span>
                </div>

                {/* Barre de progression */}
                <div
                    className="relative h-1 w-full bg-ice/10"
                    role="progressbar"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={pourcentage}
                    aria-label="Progression du chargement"
                >
                    <div
                        className="h-full w-full origin-left bg-linear-to-r from-steel via-teal to-sky shadow-[0_0_14px_#7BBDE8]"
                        style={{ transform: `scaleX(${progress / 100})` }}
                    />
                </div>
            </div>
        </div>
    );
};
export default DemarragePage;
