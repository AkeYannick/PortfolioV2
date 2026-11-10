import { useRef, type MouseEvent, type ReactNode } from "react";

type TiltProps = {
    children: ReactNode;
    className?: string;
    /** Inclinaison maximale en degrés (défaut 10) */
    max?: number;
    /** Affiche un reflet lumineux suivant le curseur (défaut true) */
    glare?: boolean;
    /** Facteur d'agrandissement au survol (défaut 1.02) */
    scale?: number;
};

/**
 * Carte à inclinaison 3D : suit le curseur avec `rotateX/rotateY` en
 * perspective CSS et superpose un reflet radial. Le contenu interne peut
 * être décalé en Z via `transform: translateZ(...)` pour un effet de profondeur.
 */
const Tilt = ({ children, className = "", max = 10, glare = true, scale = 1.02 }: TiltProps) => {
    const innerRef = useRef<HTMLDivElement>(null);
    const glareRef = useRef<HTMLDivElement>(null);
    const rafRef = useRef(0);

    const onMove = (e: MouseEvent<HTMLDivElement>) => {
        const el = innerRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width;
        const py = (e.clientY - rect.top) / rect.height;
        const rx = (0.5 - py) * 2 * max;
        const ry = (px - 0.5) * 2 * max;

        cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(() => {
            if (!el) return;
            el.style.transform = `rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) scale3d(${scale}, ${scale}, ${scale})`;
            if (glareRef.current) {
                glareRef.current.style.background = `radial-gradient(circle at ${(px * 100).toFixed(1)}% ${(py * 100).toFixed(1)}%, rgba(189,216,233,0.28), transparent 55%)`;
                glareRef.current.style.opacity = "1";
            }
        });
    };

    const onLeave = () => {
        const el = innerRef.current;
        if (!el) return;
        cancelAnimationFrame(rafRef.current);
        el.style.transform = "rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
        if (glareRef.current) glareRef.current.style.opacity = "0";
    };

    return (
        <div style={{ perspective: "1000px" }} className="h-full">
            <div
                ref={innerRef}
                onMouseMove={onMove}
                onMouseLeave={onLeave}
                className={`relative h-full transition-transform duration-300 ease-out will-change-transform ${className}`}
                style={{ transformStyle: "preserve-3d" }}
            >
                {children}
                {glare && (
                    <div
                        ref={glareRef}
                        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300"
                        style={{ transform: "translateZ(1px)" }}
                    />
                )}
            </div>
        </div>
    );
};

export default Tilt;
