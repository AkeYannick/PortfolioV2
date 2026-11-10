import { Dot } from "lucide-react";
import Tarifsblock from "../components/Tarifsblock";
import Reveal from "../components/Reveal";



const Tarifs = () =>{

    const tarifs = [
        { numero: "01", titre: "Site vitrine", prix: "À partir de 150 000 FCFA" },
        { numero: "02", titre: "Application web sur-mesure", prix: "À partir de 400 000 FCFA" },
        { numero: "03", titre: "Application mobile (Android / iOS)", prix: "À partir de 600 000 FCFA" },
        { numero: "04", titre: "Affiche / Flyer", prix: "À partir de 15 000 FCFA" },
        { numero: "05", titre: "Identité visuelle complète", prix: "À partir de 100 000 FCFA" },
        { numero: "06", titre: "Retouche photo à l'unité", prix: "À partir de 5 000 FCFA" },
        { numero: "07", titre: "Pack retouche (10 photos)", prix: "35 000 FCFA" },
    ];

    return(

        <div className="py-10 px-4 sm:px-6 lg:p-10 scroll-offset" id="Tarifs">
            <Reveal>
                <span className="flex items-center text-sky"><Dot color="#7BBDE8" size={50} className="animate-pulse"/>TARIFS</span>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-ice">Des prix clairs, sans surprise.</h2>
                <p className="text-ice/70">Points de départ indicatifs — chaque projet est chiffré précisément après un premier échange.</p>
            </Reveal><br />


            <div>
                {tarifs.map((t, index) => (
                    <div key={t.numero}>
                        <Reveal delay={index * 60} variant="left">
                            <Tarifsblock numero={t.numero} titre={t.titre} prix={t.prix}/>
                        </Reveal>
                        {index < tarifs.length - 1 && <div className="border border-ice/15"/>}
                    </div>
                ))}
            </div>
        </div>
    )
}
export default Tarifs;
