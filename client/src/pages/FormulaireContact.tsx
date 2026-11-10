import { CheckCircle2, ChevronDown, MoveLeft, MoveRight } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import image_enhanced from "../assets/image_enhanced.png";
import Reveal from "../components/Reveal";

const Stylelabel = "text-ice/40 font-serif";
const StyleInput =
    "w-full py-3 px-2 rounded-sm border bg-ice font-serif text-abyss outline-none transition-all duration-300 focus:ring-2 focus:ring-sky focus:border-sky focus:scale-[1.01]";

const SERVICES = [
    "Développement d'un site web",
    "Développement d'une application web",
    "Développement d'une application mobile",
    "Création d'affiche / flyer",
    "Retouche photo",
    "Autre demande",
];

const FormulaireContact = () => {
    const [prenom, setPrenom] = useState("");
    const [nom, setNom] = useState("");
    const [service, setService] = useState("");
    const [email, setEmail] = useState("");
    const [newsletter, setNewsletter] = useState(false);
    const [message, setMessage] = useState("");
    const [envoye, setEnvoye] = useState(false);

    const EnvoyerMessage = (e: React.FormEvent) => {
        e.preventDefault();
        setEnvoye(true);
    };

    return (
        <div className="relative bg-linear-to-br from-abyss via-deep/60 to-teal/30 w-full min-h-screen overflow-hidden">
            <div
                aria-hidden="true"
                className="absolute right-0 -top-25 z-0 pointer-events-none bg-cover bg-no-repeat animate-float-slow
             w-64 h-125 opacity-25
             sm:w-80 sm:h-150 sm:opacity-40
             lg:w-100 lg:h-191 lg:opacity-100"
                style={{
                    backgroundImage: `url(${image_enhanced})`,
                    WebkitMaskImage: "linear-gradient(to bottom, black 55%, transparent 100%)",
                    maskImage: "linear-gradient(to bottom, black 55%, transparent 100%)",
                }}
            />

            <div className="relative z-10 py-5 px-4 sm:px-6 lg:px-10 xl:px-20">
                {/* Retour + titre, comme la maquette */}
                <div className="flex items-center gap-4 sm:gap-10 animate-fade-in-up">
                    <Link to="/">
                        <button className="cursor-pointer transition-transform duration-300 hover:-translate-x-1.5 hover:scale-110" aria-label="Retour à l'accueil">
                            <MoveLeft color="#BDD8E9" className="w-9 h-9 sm:w-11 sm:h-11" />
                        </button>
                    </Link>
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-sky">Démarrons un projet ensemble</h2>
                </div>

                <h1 className="mt-6 mb-10 sm:mt-8 sm:mb-14 text-5xl sm:text-7xl lg:text-8xl xl:text-9xl font-bold font-serif text-ice animate-fade-in-up" style={{ animationDelay: "100ms" }}>
                    Contact
                </h1>

                {/* Coordonnées à gauche, formulaire à droite (empilés sur mobile) */}
                <div className="grid grid-cols-1 lg:grid-cols-[minmax(260px,340px)_1fr] gap-12 lg:gap-20 xl:gap-30">
                    <Reveal variant="left">
                        <div className="flex flex-col gap-8 text-ice">
                            <div>
                                <p className="font-serif text-lg font-bold text-sky">Localisation</p>
                                <p className="text-ice/70">Abidjan, Côte d'Ivoire</p>
                            </div>
                            <div>
                                <p className="font-serif text-lg font-bold text-sky">Email</p>
                                <a href="mailto:akeleonyannickdonovane@gmail.com" className="link-underline text-ice/70 hover:text-ice transition-colors duration-300 break-all">
                                    akeleonyannickdonovane@gmail.com
                                </a>
                            </div>
                            <div>
                                <p className="font-serif text-lg font-bold text-sky">WhatsApp</p>
                                <a href="https://wa.me/2250714266275" target="_blank" rel="noopener noreferrer" className="link-underline text-ice/70 hover:text-ice transition-colors duration-300">
                                    +225 07 14 26 62 75
                                </a>
                            </div>
                            <div>
                                <p className="font-serif text-lg font-bold text-sky">Disponibilités</p>
                                <p className="text-ice/70">Lundi – Vendredi, 8h – 18h (GMT)</p>
                                <p className="text-ice/70">Réponse sous 24h</p>
                            </div>
                        </div>
                    </Reveal>

                    <form onSubmit={EnvoyerMessage} className="w-full max-w-3xl">
                        <Reveal delay={80}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-10">
                                <div>
                                    <label htmlFor="prenom" className={Stylelabel}>Prénom *</label><br />
                                    <input id="prenom" type="text" required value={prenom} onChange={(e) => setPrenom(e.target.value)} placeholder="Votre prénom" className={StyleInput} />
                                </div>
                                <div>
                                    <label htmlFor="nom" className={Stylelabel}>Nom *</label><br />
                                    <input id="nom" type="text" required value={nom} onChange={(e) => setNom(e.target.value)} placeholder="Votre nom" className={StyleInput} />
                                </div>
                            </div>
                        </Reveal>
                        <br /><br />

                        <Reveal delay={140}>
                            <label htmlFor="service" className={Stylelabel}>Service</label><br />
                            <div className="relative">
                                <select
                                    id="service"
                                    value={service}
                                    onChange={(e) => setService(e.target.value)}
                                    className={StyleInput + " cursor-pointer appearance-none pr-10"}
                                >
                                    <option value="">Choisir un service…</option>
                                    {SERVICES.map((s) => (
                                        <option key={s} value={s}>{s}</option>
                                    ))}
                                </select>
                                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-abyss/60" />
                            </div>
                        </Reveal>
                        <br /><br />

                        <Reveal delay={200}>
                            <label htmlFor="email" className={Stylelabel}>Email *</label><br />
                            <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="exemple@gmail.com" className={StyleInput} />
                        </Reveal>
                        <br /><br />

                        <Reveal delay={240}>
                            <label htmlFor="newsletter" className="flex cursor-pointer items-center gap-3 w-fit text-ice/70 font-serif transition-colors duration-300 hover:text-ice">
                                <input
                                    id="newsletter"
                                    type="checkbox"
                                    checked={newsletter}
                                    onChange={(e) => setNewsletter(e.target.checked)}
                                    className="h-4 w-4 cursor-pointer accent-sky"
                                />
                                Je souhaite recevoir les actualités et offres
                            </label>
                        </Reveal>
                        <br /><br />

                        <Reveal delay={300}>
                            <label htmlFor="message" className={Stylelabel}>Description du projet</label><br />
                            <textarea
                                id="message"
                                name="message"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Décrivez votre projet en quelques lignes…"
                                className="w-full h-40 py-2 px-2 rounded-sm border bg-ice font-serif text-abyss outline-none resize-y transition-all duration-300 focus:ring-2 focus:ring-sky focus:border-sky"
                            />
                        </Reveal>
                        <br />

                        <Reveal delay={360}>
                            <div>
                                <button
                                    type="submit"
                                    disabled={envoye}
                                    className="shine group bg-sky w-full text-abyss font-bold flex items-center gap-5 justify-center cursor-pointer py-3 px-10 rounded-xl shadow-2xl shadow-abyss/60 backdrop-blur-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-sky/40 active:scale-95 disabled:cursor-default"
                                >
                                    {envoye ? (
                                        <>
                                            <span className="animate-fade-in">MESSAGE ENVOYÉ</span>
                                            <CheckCircle2 className="animate-scale-in" />
                                        </>
                                    ) : (
                                        <>
                                            ENVOYER LE MESSAGE
                                            <MoveRight className="transition-transform duration-300 group-hover:translate-x-1.5" />
                                        </>
                                    )}
                                </button>
                            </div>
                        </Reveal>

                        <div>....</div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default FormulaireContact;
