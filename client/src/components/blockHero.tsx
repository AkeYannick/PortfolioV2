

type props = {
    numero: string;
    titre: string;
    delay?: number;
}

const BlockHero = ({numero, titre, delay = 0}: props) =>{
    return(
        <div className="group cursor-default transition-transform duration-300 hover:-translate-y-1" style={{ animationDelay: `${delay}ms` }}>
            <span className="text-ice/70 transition-colors duration-300 group-hover:text-sky">{numero}</span>
            <h2 className="text-base sm:text-xl text-ice font-serif relative inline-block">
                {titre}
                <span className="absolute left-0 -bottom-1 h-0.5 w-0 bg-sky transition-all duration-300 group-hover:w-full"/>
            </h2>
        </div>
    )
}
export default BlockHero;
