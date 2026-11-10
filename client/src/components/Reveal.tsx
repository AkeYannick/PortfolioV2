import type { ReactNode } from "react";
import { useReveal } from "../hooks/useReveal";

type RevealProps = {
    children: ReactNode;
    delay?: number;
    className?: string;
    /** "up" (défaut) glisse depuis le bas, "scale" zoome légèrement, "left"/"right" glissent latéralement */
    variant?: "up" | "scale" | "left" | "right";
};

const variantClass: Record<NonNullable<RevealProps["variant"]>, string> = {
    up: "reveal-up",
    scale: "reveal-scale",
    left: "reveal-left",
    right: "reveal-right",
};

const Reveal = ({ children, delay = 0, className = "", variant = "up" }: RevealProps) => {
    const { ref, visible } = useReveal();

    return (
        <div
            ref={ref}
            className={`reveal ${variantClass[variant]} ${visible ? "reveal-visible" : ""} ${className}`}
            style={{ transitionDelay: visible ? `${delay}ms` : "0ms" }}
        >
            {children}
        </div>
    );
};

export default Reveal;
