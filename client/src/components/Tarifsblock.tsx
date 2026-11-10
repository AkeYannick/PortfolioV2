

type TarifsProps ={
    numero: string,
    titre: string,
    prix: string,
}

const Tarifsblock = ({numero,titre,prix}: TarifsProps) =>{
    return(
        <div>

             <div className="group flex flex-col gap-1 sm:flex-row sm:justify-between sm:gap-4 text-ice py-5 px-3 rounded-lg transition-all duration-300 hover:bg-ice/5 hover:px-5 hover:shadow-lg hover:shadow-sky/5 cursor-default">
                <div className="flex gap-5 min-w-0">
                    <span className="text-ice/30 transition-colors duration-300 group-hover:text-sky">{numero}</span>
                    <h2 className="transition-transform duration-300 group-hover:translate-x-1">{titre}</h2>
                </div>
                <div>
                    <h3 className="text-sky font-bold pl-9 sm:pl-0 sm:whitespace-nowrap transition-transform duration-300 group-hover:scale-110 origin-left sm:origin-right">{prix}</h3>
                </div>
            </div>

        </div>
    )
}
export default Tarifsblock;
