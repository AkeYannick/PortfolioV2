

type PropsServices = {
    nombre: string,
    titre: string,
    description: string,
}


const BlockServices = ({nombre, titre, description}: PropsServices) =>{
    return(
        <div className="h-full">

            <div className="group w-full h-full rounded-xl border border-ice/10 bg-ice/5 backdrop-blur-md hover:border-sky hover:shadow-xl hover:shadow-sky/10 hover:bg-ice/10 p-4 lg:p-3 duration-350 transition-all">
                <div className="flex flex-col gap-5">
                    <span className="text-sky font-bold text-xl inline-block transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6 w-fit">{nombre}</span>
                    <h2 className="text-ice font-bold text-xl transition-colors duration-300">{titre}</h2>
                    <p className="text-ice/50 transition-colors duration-300 group-hover:text-ice/80">{description}</p>
                </div>
            </div>

        </div>
    )
}
export default BlockServices;
