import Router from "next/router";
import { api } from "../utils/api";
import { useSession } from "next-auth/react";



interface Asignatura {
    nombre: string;
    asignaturaId: string;
    tiempoObjetivo: number;
    tiempoTotal: number;
}


const TarjetaAsignatura: React.FC<Asignatura> = ({ nombre, asignaturaId, tiempoObjetivo, tiempoTotal}) => {


    function pasarHoraOMinutos(tiempo: number) {
        if (tiempo >= 60) {
            let horas = tiempo / 60;
            horas = Math.floor(horas);
            let minutos = tiempo % 60;
            return horas + "h " + minutos + "min";
        } else {
            return tiempo + " minutos";
        }
    }

    const tiempoFinal = pasarHoraOMinutos(tiempoTotal);
    

    return (
        <a className="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 col-span-12 sm:col-span-6 md:col-span-3"
            onClick={() => Router.push("/a/" + asignaturaId)}
            key={asignaturaId}
        >
            <img className="object-cover w-1/2 h-full rounded-t-lg md:h-auto md:w-2/5 md:rounded-none md:rounded-l-lg" src="https://cdn.discordapp.com/attachments/1061231463405719556/1067003573499609088/cachvza_a_person_alone_walking_on_a_deserted_and_mountainous_pa_3aab462e-773a-414b-8565-547f33842059.png" alt=""></img>
            <div className="flex flex-col justify-between p-4 leading-normal">
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{nombre}</h5>
                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{tiempoFinal}</p>
            </div>
        </a>
    )
}

export default TarjetaAsignatura;