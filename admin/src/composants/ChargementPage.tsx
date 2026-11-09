import { useEffect, useState } from "react";

const LETTRES = ["A", "K", "E", ".", "D", "e", "v"];

/** Durée de montée du rideau, une fois le travail terminé. */
const DUREE_SORTIE = 700;

type Props = {
    /** À false : le rideau se lève (l'application s'affiche déjà derrière). */
    visible: boolean;
    message: string;
};

/**
 * Page de chargement du dashboard, dans le langage visuel du site (halo, AKE.Dev, barre de progression).
 * La barre grimpe jusqu'à 92 % en attendant la fin de la requête, puis atteint 100 % avant de se lever.
 */
const ChargementPage = ({ visible, message }: Props) => {
    const [monte, setMonte] = useState(visible);
    const [pourcentage, setPourcentage] = useState(0);

    useEffect(() => {
        if (visible) {
            setMonte(true);
            return;
        }
        const id = window.setTimeout(() => setMonte(false), DUREE_SORTIE);
        return () => window.clearTimeout(id);
    }, [visible]);

    useEffect(() => {
        if (!visible) {
            setPourcentage(100);
            return;
        }
        // Le pourcentage reste en mémoire entre deux affichages : on repart de zéro.
        setPourcentage(0);
        const debut = Date.now();
        const minute = window.setInterval(() => {
            const t = Math.min((Date.now() - debut) / 1600, 1);
            setPourcentage(Math.round(92 * (1 - Math.pow(1 - t, 3))));
        }, 60);
        return () => window.clearInterval(minute);
    }, [visible]);

    if (!monte) return null;

    return (
        <div
            role="status"
            aria-live="polite"
            aria-busy={visible}
            className={`fixed inset-0 z-50 flex flex-col overflow-hidden bg-abyss transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${
                visible ? "translate-y-0" : "-translate-y-full rounded-b-4xl"
            }`}
        >
            <div
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 top-1/2 h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-sky/20 blur-3xl"
            />

            <div className="relative flex items-center justify-between px-5 pt-6 font-serif text-xs text-ice/40 sm:px-10 sm:pt-8">
                <span>Administration</span>
                <span>Abidjan, CI</span>
            </div>

            <div className="relative flex flex-1 flex-col items-center justify-center gap-5 px-5 text-center">
                <h1 className="flex font-serif text-5xl font-bold tracking-tight text-ice sm:text-7xl">
                    {LETTRES.map((lettre, index) => (
                        <span
                            key={`${lettre}-${index}`}
                            className="inline-block"
                            style={{
                                animation: "apparition 600ms cubic-bezier(0.16,1,0.3,1) both",
                                animationDelay: `${180 + index * 80}ms`,
                            }}
                        >
                            {lettre === "." ? <span className="animate-pulse inline-block text-sky">.</span> : lettre}
                        </span>
                    ))}
                </h1>
                <p className="font-serif text-ice/60 text-sm sm:text-base">{message}</p>
            </div>

            <div className="relative flex items-end justify-between gap-6 px-5 pb-6 sm:px-10 sm:pb-8">
                <span className="font-serif text-xs text-ice/40 sm:text-sm">Portfolio AKE Donovane</span>
                <span className="font-serif text-5xl font-bold leading-none tabular-nums text-ice sm:text-7xl">
                    {pourcentage}
                    <span className="text-xl text-sky sm:text-3xl">%</span>
                </span>
            </div>

            <div
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={pourcentage}
                aria-label={message}
                className="relative h-1 w-full bg-ice/10"
            >
                <div
                    className="h-full origin-left bg-linear-to-r from-steel via-teal to-sky shadow-[0_0_14px_#7BBDE8] transition-[width] duration-200 ease-out"
                    style={{ width: `${pourcentage}%` }}
                />
            </div>
        </div>
    );
};

export default ChargementPage;
