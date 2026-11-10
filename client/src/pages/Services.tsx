import { Dot } from "lucide-react";
import BlockServices from "../components/blockServices";
import Reveal from "../components/Reveal";
import Tilt from "../components/Tilt";



const Services =()=>{
    return(
        <div className="py-12 px-4 sm:px-6 lg:py-20 lg:p-10 scroll-offset" id="Services">
            <Reveal>
                <span className="flex items-center text-sky"><Dot color="#7BBDE8" size={50} className="animate-pulse"/>CE QUE JE PROPOSE</span>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-ice">Quatre métiers, une seule signature.</h2>
            </Reveal><br />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

                <Reveal delay={0} className="h-full"><Tilt max={9}><BlockServices nombre={"01"} titre={"Développement Web"} description={"Sites vitrines et plateformes sur-mesure, rapides et faciles à faire évoluer."}/></Tilt></Reveal>
                <Reveal delay={100} className="h-full"><Tilt max={9}><BlockServices nombre={"02"} titre={"Développement Mobile"} description={"Applications iOS et Android, de la maquette au déploiement sur les stores."}/></Tilt></Reveal>
                <Reveal delay={200} className="h-full"><Tilt max={9}><BlockServices nombre={"03"} titre={"Création d'Affiches"} description={"Affiches et flyers pensés pour l'impact, prêts pour l'impression."}/></Tilt></Reveal>
                <Reveal delay={300} className="h-full"><Tilt max={9}><BlockServices nombre={"04"} titre={"Retouche Photoshop"} description={"Détourage, correction colorimétrique et retouche portrait ou produit."}/></Tilt></Reveal>

            </div>
        </div>
    )
}
export default Services;
