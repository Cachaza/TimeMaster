import { api } from "../utils/api";
import { getSession , useSession} from "next-auth/react"
import { useState } from "react"
import "tailwindcss/tailwind.css"
import Router from "next/router";


export default function FormularioCrearAsignatura() {
    const { data: sessionData } = useSession();
    const [nombre, setNombre] = useState("");
    
    const crear = api.asignaturas.createAsignatura2.useMutation();

    return (
        <form onSubmit={async (e) => {
            e.preventDefault()
            await crear.mutateAsync({
                nombre: nombre,
                id: sessionData?.user?.id
            })
            Router.push("/user");
            window.location.reload();

                        
        }}>
            <div className="flex flex-col items-center justify-center py-2 px-14 text-center">
                <h1 className="text-4xl font-bold">Crear Asignatura</h1>
                <p className="mt-3 text-2xl">Por favor ingrese el nombre de la asignatura</p>
                <div className="pt-6">
                    <input
                        type="text"
                        placeholder="Nombre"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        className="p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500, text-black"
                    />
                    <button
                        type="submit"
                        className="p-2 mt-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
                    >
                        Crear
                    </button>
                </div>
            </div>


        </form>
    )


}



