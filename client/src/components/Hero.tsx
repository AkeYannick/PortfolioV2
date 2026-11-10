import { Dot, MoveRight } from "lucide-react";
import BlockHero from "./blockHero";
import Code3D from "./Code3D";
import image_enhanced from "../assets/image_enhanced.png";
import Reveal from "./Reveal";
import Tilt from "./Tilt";


const Hero = () =>{
    return(
        <div className="pt-20 px-4 pb-6 sm:px-6 lg:p-10 lg:pt-20">

                <Tilt max={4} glare={false} scale={1.005}>
                <div className="relative bg-linear-to-br from-deep/90 via-deep/40 to-teal/30 backdrop-blur-md border border-ice/15 rounded-3xl lg:rounded-4xl shadow-2xl shadow-abyss/60 w-full lg:h-140 p-6 sm:p-10 flex flex-col gap-10 lg:gap-50 overflow-hidden animate-scale-in">

                    {/* Halo lumineux en coin de carte */}
                    <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-sky/20 blur-3xl" />

                    <div className="flex flex-col lg:flex-row justify-between gap-6" style={{ transform: "translateZ(40px)" }}>
                        <div className="animate-fade-in-up" style={{ animationDelay: "120ms" }}>
                            <span className="text-ice">Bonjour, je suis</span><br /><br />
                            <h2 className="text-4xl sm:text-6xl lg:text-7xl text-ice font-bold font-serif">Développeur <br /> & Designer</h2>
                        </div>

                        {/* Sur mobile / tablette l'image est dans le flux ; à partir de lg elle est collée en haut à droite de la carte */}
                        <div
                            className="self-center w-56 h-72 sm:w-64 sm:h-80 lg:self-auto lg:absolute lg:right-0 lg:top-[13px] lg:w-100 lg:h-125 bg-cover bg-center"
                            style={{
                                backgroundImage: `url(${image_enhanced})`,
                                WebkitMaskImage: "linear-gradient(to bottom, black 55%, transparent 100%)",
                                maskImage: "linear-gradient(to bottom, black 55%, transparent 100%)",
                            }}
                            role="img"
                            aria-label="Portrait de AKE.Dev"
                        />

                    </div>

                    <div className="animate-fade-in-up" style={{ animationDelay: "280ms", transform: "translateZ(60px)" }}>
                        <div className="border-t border-ice/40"/>
                        <br />

                        <div className="grid grid-cols-2 gap-x-6 gap-y-6 lg:flex lg:items-center lg:gap-10">
                            <BlockHero numero={"01"} titre={"Développement Web"} delay={0}/>
                            <BlockHero numero={"02"} titre={"Développement Mobile"} delay={90}/>
                            <BlockHero numero={"03"} titre={"Création d'Affiches"} delay={180}/>
                            <BlockHero numero={"04"} titre={"Retouche Photoshop"} delay={270}/>
                        </div>
                    </div>

                </div>
                </Tilt>


                {/* Cartes 3D au code JavaScript / PHP / Dart qui défile */}
                <Reveal variant="scale" className="mt-10 lg:mt-14">
                    <p className="text-center font-serif text-sky mb-3 sm:mb-4">&lt;/&gt; — JavaScript · PHP · Dart</p>
                    <Code3D className="w-full h-80 sm:h-104 lg:h-120" />
                </Reveal>


                {/* 2ème Partie du hero */}
                <div>

                    <div className="flex flex-col lg:flex-row justify-between gap-6 lg:gap-20 text-ice py-12 lg:py-20">

                        <Reveal variant="left">
                            <span className="flex items-center text-sky"><Dot color="#7BBDE8" size={50} className="animate-pulse"/>DERRIÈRE LES CRÉATIONS</span>
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif">Concevoir des expériences qui simplifient la vie.</h2>
                        </Reveal>
                        <Reveal variant="right" delay={120} className="lg:pt-30">
                            <p className="text-ice/70">Je suis développeur et designer freelance, concentré sur la création de produits clairs, rapides et agréables à utiliser — du premier trait au dernier commit.</p>
                        </Reveal>
                    </div>


                    <Reveal className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-5 text-ice" delay={100}>
                        <span>Construisons quelque chose de significatif ensemble.</span>
                        <a href="#Contact" className="w-fit">
                            <button className="shine group bg-sky text-abyss px-4 py-3 font-bold cursor-pointer rounded-xl flex items-center gap-3 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-sky/40">
                                Me Contacter
                                <MoveRight className="transition-transform duration-300 group-hover:translate-x-1.5" />
                            </button>
                        </a>
                    </Reveal>

                </div>

        </div>
    )
}
export default Hero;
