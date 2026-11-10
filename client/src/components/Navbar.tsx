import { Menu, MoveUpRight, X } from "lucide-react";
import { useEffect, useState } from "react";

const NAV_LINKS = [
    { href: "#", label: "Accueil" },
    { href: "#Projets", label: "Projets" },
    { href: "#Parcours", label: "Parcours" },
    { href: "#Services", label: "Services" },
    { href: "#Tarifs", label: "Tarifs" },
];

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 12);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    // Menu mobile : bloque le scroll de la page, se ferme avec Échap
    // et se referme tout seul si on passe en affichage desktop.
    useEffect(() => {
        if (!menuOpen) return;

        const previous = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setMenuOpen(false);
        };
        const desktop = window.matchMedia("(min-width: 1024px)");
        const onResize = () => {
            if (desktop.matches) setMenuOpen(false);
        };

        window.addEventListener("keydown", onKey);
        desktop.addEventListener("change", onResize);
        return () => {
            document.body.style.overflow = previous;
            window.removeEventListener("keydown", onKey);
            desktop.removeEventListener("change", onResize);
        };
    }, [menuOpen]);

    const closeMenu = () => setMenuOpen(false);

    return (
        <>
            {/* Barre de navigation (fixe sur tous les écrans).
                Transparente en haut de page (elle épouse le fond), elle se colore au défilement.
                L'animation est posée directement sur la barre : un parent animé avec `transform`
                empêcherait `position: fixed` de fonctionner. */}
            <div
                className={`fixed top-0 left-0 w-full z-50 flex justify-between items-center px-5 sm:px-10 transition-all duration-500 ease-out animate-slide-down ${
                    scrolled
                        ? "h-14 bg-linear-to-b from-abyss/90 to-deep/60 backdrop-blur-xl border-b border-ice/10 shadow-lg shadow-abyss/60"
                        : "h-18 bg-transparent border-b border-transparent"
                }`}
            >

                <a href="#" onClick={closeMenu} aria-label="AKE.Dev — Accueil">
                    <h2 className="text-ice text-2xl sm:text-3xl lg:text-4xl font-serif font-bold transition-transform duration-300 hover:scale-105 cursor-default">
                        AKE<span className="text-sky inline-block animate-pulse">.</span>Dev
                    </h2>
                </a>

                {/* Navigation desktop */}
                <div className="lg:flex gap-10 list-none hidden">
                    {NAV_LINKS.map((link) => (
                        <a
                            key={link.label}
                            href={link.href}
                            className="link-underline text-ice/70 hover:text-ice font-bold font-serif transition-colors ease-in-out duration-300"
                        >
                            <li>{link.label}</li>
                        </a>
                    ))}
                </div>

                <a href="#Contact" className="hidden lg:block">
                    <button className="shine btn font-serif bg-ice text-abyss rounded-xl px-3 py-1.5 flex items-center gap-3 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-sky/30">
                        Me contacter
                        <h2 className="bg-sky px-1 py-1 rounded-2xl transition-transform duration-300 group-hover:translate-x-1">
                            <MoveUpRight size={20} color="#001D39" />
                        </h2>
                    </button>
                </a>

                {/* Bouton menu mobile / tablette */}
                <button
                    onClick={() => setMenuOpen((v) => !v)}
                    className="lg:hidden -mr-2 flex h-11 w-11 items-center justify-center text-ice transition-transform duration-300 active:scale-90 cursor-pointer"
                    aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
                    aria-expanded={menuOpen}
                    aria-controls="menu-mobile"
                >
                    <span className="relative block w-6 h-6">
                        <Menu className={`absolute inset-0 transition-all duration-300 ${menuOpen ? "opacity-0 rotate-90 scale-50" : "opacity-100 rotate-0 scale-100"}`} />
                        <X className={`absolute inset-0 transition-all duration-300 ${menuOpen ? "opacity-100 rotate-0 scale-100 text-sky" : "opacity-0 -rotate-90 scale-50"}`} />
                    </span>
                </button>
            </div>

            {/* Menu mobile plein écran */}
            <div
                id="menu-mobile"
                className={`lg:hidden fixed inset-0 z-40 bg-abyss bg-[radial-gradient(circle_at_100%_100%,#7BBDE840,transparent_60%)] overflow-y-auto transition-all duration-500 ease-out ${
                    menuOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
                }`}
            >
                <nav className="flex min-h-full flex-col justify-center px-6 pt-24 pb-8 sm:px-10" aria-label="Menu principal">
                    <span className="mb-4 flex items-center font-serif text-sm text-sky">
                        MENU
                    </span>

                    {NAV_LINKS.map((link, i) => (
                        <a
                            key={link.label}
                            href={link.href}
                            onClick={closeMenu}
                            className="group flex items-baseline gap-4 border-b border-ice/10 py-4 transition-all duration-500 ease-out"
                            style={{
                                transitionDelay: menuOpen ? `${120 + i * 70}ms` : "0ms",
                                opacity: menuOpen ? 1 : 0,
                                transform: menuOpen ? "translateY(0)" : "translateY(18px)",
                            }}
                        >
                            <span className="font-serif text-sm text-sky">0{i + 1}</span>
                            <span className="font-serif text-4xl font-bold text-ice transition-transform duration-300 group-hover:translate-x-2 group-active:translate-x-2 sm:text-5xl">
                                {link.label}
                            </span>
                            <MoveUpRight className="ml-auto self-center text-ice/30 transition-colors duration-300 group-hover:text-sky group-active:text-sky" size={22} />
                        </a>
                    ))}

                    <a
                        href="#Contact"
                        onClick={closeMenu}
                        className="mt-8 transition-all duration-500 ease-out"
                        style={{
                            transitionDelay: menuOpen ? `${120 + NAV_LINKS.length * 70}ms` : "0ms",
                            opacity: menuOpen ? 1 : 0,
                            transform: menuOpen ? "translateY(0)" : "translateY(18px)",
                        }}
                    >
                        <button className="shine group w-full bg-sky text-abyss font-bold px-5 py-3.5 rounded-xl flex items-center justify-center gap-3 cursor-pointer transition-transform duration-300 active:scale-95">
                            Me contacter
                            <MoveUpRight size={20} className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                        </button>
                    </a>

                    <span className="mt-8 text-center text-sm text-ice/40">
                        akeleonyannickdonovane@gmail.com — Abidjan
                    </span>
                </nav>
            </div>
        </>
    )
}
export default Navbar;
