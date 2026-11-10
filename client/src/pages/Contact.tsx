import { MoveRight } from "lucide-react";
import { Link } from "react-router-dom";
import Reveal from "../components/Reveal";


const Contact = () =>{
    return(
        <div className="py-5 px-4 sm:px-6 lg:p-10 scroll-offset" id="Contact">

            <Reveal variant="scale">
            <div className="bg-linear-to-tl from-teal/80 via-deep/80 to-deep/40 backdrop-blur-md border border-ice/15 rounded-3xl lg:rounded-4xl shadow-2xl shadow-abyss/60 w-full h-full py-12 px-5 sm:py-20 sm:p-10 flex flex-col gap-12 lg:gap-35 gradient-animated ">

                <div className="flex flex-col text-center sm:px-10">
                    <div>
                        <h2 className="text-4xl sm:text-5xl lg:text-7xl text-ice font-bold font-serif">Un projet en tête ? Parlons-en.</h2><br />
                        <p className="text-ice/80 md:px-20 lg:px-60 text-base sm:text-xl">Que ce soit un site, une application ou une affiche, décrivez votre besoin — je reviens vers vous avec un devis sous 24h.</p>
                    </div>

                    <div className="flex justify-center py-10">
                       <Link to="/Formulaire">
                           <button className="shine group bg-ice text-abyss font-bold px-4 py-3 cursor-pointer rounded-xl flex items-center gap-3 transition-all duration-300 hover:scale-105 hover:shadow-xl animate-pulse-glow">
                               Envoyer un message
                               <MoveRight className="transition-transform duration-300 group-hover:translate-x-1.5"/>
                           </button>
                        </Link>
                    </div>


                    <div className="flex flex-wrap items-center gap-x-8 gap-y-3 sm:gap-x-10 justify-center list-none text-ice font-bold">
                        {/* TODO : remplacer les liens sociaux (#) par vos profils TikTok / Instagram */}
                        <a href="mailto:akeleonyannickdonovane@gmail.com" className="link-underline transition-transform duration-300 hover:scale-105"><li>akeleonyannickdonovane@gmail.com</li></a>
                        <a href="https://wa.me/2250714266275" target="_blank" rel="noopener noreferrer" className="link-underline transition-transform duration-300 hover:scale-105"><li>WhatsApp</li></a>
                        <a href="https://github.com/AkeYannick" target="_blank" rel="noopener noreferrer" className="link-underline transition-transform duration-300 hover:scale-105"><li>GitHub</li></a>
                        <a href="#" className="link-underline transition-transform duration-300 hover:scale-105"><li>TikTok</li></a>
                    </div>


                </div>

            </div>
            </Reveal>

        </div>
    )
}
export default Contact;
