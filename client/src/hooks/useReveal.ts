import { useEffect, useRef, useState } from "react";

/**
 * Hook léger de "reveal on scroll" basé sur IntersectionObserver.
 * Pas de dépendance externe (pas de framer-motion) : renvoie une ref à poser
 * sur l'élément à observer et un booléen `visible` qui passe à true
 * une seule fois lorsque l'élément entre dans le viewport.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(threshold = 0.15) {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Si l'utilisateur préfère moins d'animations, on affiche direct.
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(node);
        }
      },
      { threshold, rootMargin: "0px 0px -60px 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, visible };
}
