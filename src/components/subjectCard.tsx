import Link from "next/link";
import Image from "next/image";




interface Asignatura {
    nombre: string;
    asignaturaId: string;
    tiempoObjetivo: number;
    tiempoTotal: number;
}


const SubjectCard: React.FC<Asignatura> = ({ nombre, asignaturaId, tiempoObjetivo, tiempoTotal}) => {


    function pasarHoraOMinutos(tiempo: number) {
        if (tiempo >= 60) {
            let hours = tiempo / 60;
            hours = Math.floor(hours);
            const minutes = tiempo % 60;
            return String(hours) + "h " + String(minutes) + "min";
        } else {
            return String(tiempo) + " minutos";
        }
    }

    const tiempoFinal = pasarHoraOMinutos(tiempoTotal);
    

    return (
        <Link className="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 col-span-2"
            href={"/a/" + asignaturaId}
            key={asignaturaId}
        >
            <div className="flex flex-col justify-between p-4 leading-normal">
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{nombre}</h5>
                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{tiempoFinal}</p>
            </div>
        </Link>
    )
}

export default SubjectCard;