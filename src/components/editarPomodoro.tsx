import { api } from "../utils/api";
import { getSession , useSession} from "next-auth/react"
import { useState } from "react"
import "tailwindcss/tailwind.css"
import Router from "next/router";
import Asignatura from "../pages/a/[id]";
import DeleteButton from "./modalEliminarAsignatura";


interface Asignatura {
    Inombre: string;
    ItiempoTrabajo: number;
    ItiempoDescanso: number;
    ItiempoObjetivo: number;
    IasignaturaId: string;
}


const EditarAsignatura: React.FC<Asignatura> = ({Inombre, ItiempoTrabajo, ItiempoDescanso, ItiempoObjetivo, IasignaturaId}) => {
    const { data: sessionData } = useSession();
    const [nombre, setNombre] = useState(Inombre);
    const [tiempoTrabajo, setTiempoTrabajo] = useState(ItiempoTrabajo ?? 25);
    const [tiempoDescanso, setTiempoDescanso] = useState(ItiempoDescanso ?? 5);
    const [timepoObjetivo, setTimepoObjetivo] = useState(ItiempoObjetivo ?? 0);

   
    const crear = api.asignaturas.modificarAsignatura.useMutation();
    
    return (
        <>
        <form onSubmit={async (e) => {
            e.preventDefault()
            await crear.mutateAsync({
                nombre: nombre,
                tiempoTrabajo: tiempoTrabajo,
                tiempoDescanso: tiempoDescanso,
                tiempoObjetivo: timepoObjetivo,
                id: sessionData?.user?.id,
                asignaturaId: IasignaturaId

            })
            Router.push("/user");
            window.location.reload();

                        
        }}>
            <div className="flex flex-col items-center justify-center py-2 px-14 text-center">
                <h1 className="text-4xl font-bold">Editar Asignatura</h1>
                <p className="mt-3 text-2xl">Nombre</p>
                <div className="pt-6">
                    <input
                        type="text"
                        placeholder="Nombre"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        className="p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500, text-black"
                    />
                    <p className="mt-3 text-2xl">Tiempo de trabajo</p>
                    <input 
                        type="number" 
                        placeholder="25"
                        value={tiempoTrabajo}
                        onChange={(e) => setTiempoTrabajo(parseInt(e.target.value))}
                        className="p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500, text-black"
                    />
                    <p className="mt-3 text-2xl">Tiempo de descanso</p>
                    <input
                        type="number"
                        placeholder="5"
                        value={tiempoDescanso}
                        onChange={(e) => setTiempoDescanso(parseInt(e.target.value))}
                        className="p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500, text-black"
                    />
                    <p className="mt-3 text-2xl">Tiempo objetivo</p>
                    <input
                        type="number"
                        placeholder="0"
                        value={timepoObjetivo}
                        onChange={(e) => setTimepoObjetivo(parseInt(e.target.value))}
                        className="p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500, text-black"
                    />
                    </div>
                    <div className="px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                        <div className="p-3">
                        <button
                            type="submit"
                            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                            Actualizar
                        </button>
                        </div>
                        <div className="p-3">
                            <DeleteButton asignaturaId={IasignaturaId}/>
                        </div>
                    </div>
            </div>


        </form>
        



        

    </>

                
    )
    


}

export default EditarAsignatura;



