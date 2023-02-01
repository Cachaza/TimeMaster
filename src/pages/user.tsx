import Navbar from "../components/navbar"
import { useState } from "react"
import "tailwindcss/tailwind.css"
import FormularioCrearAsignatura from "../components/crearAsignatura"

import Router from "next/router";


import { getSession , useSession} from "next-auth/react"
import { api } from "../utils/api"
import Link from "next/link";
import { faHomeLgAlt } from "@fortawesome/free-solid-svg-icons"

export default function User(){
    const { data: sessionData, status } = useSession();
    const [anadirAsignatura, setAnadirAsignatura] = useState(true);

    if (status === "loading") {
        return (
            <>
                <Navbar />
                <div className="flex flex-col items-center justify-center min-h-screen py-2 -mt-28 px-14 text-center">
                    <h1 className="text-4xl font-bold">Inicio de sesion</h1>
                    <p className="mt-3 text-2xl">Cargando...</p>
                </div>
            </>
        )
    }
    const descripcion = api.example.descripcion.useQuery({ id: sessionData?.user?.id });
    const asignaturas = api.asignaturas.getAsignaturas2.useQuery({ id: sessionData?.user?.id });



    

    
    return (
        <>
        <Navbar />
        {anadirAsignatura ? (
        <div className="pb-20 font-sans h-screen w-full flex flex-row justify-center items-center text-black">
                <div className="card w-3/4 mx-auto bg-white  shadow-xl rounded-xl ">
                <img className="w-32 mx-auto rounded-full -mt-20 border-8 border-white" src={sessionData?.user?.image ? sessionData?.user?.image : "https://images.squarespace-cdn.com/content/v1/5ccc49ee348cd92c42de2bb7/1614191616274-GDEYW4J7O7QNJ0ICAP17/Kim+Wood+Placeholder+Image.png?format=1000w" } alt=""></img>
                <div className="text-center mt-2 text-3xl font-medium">{sessionData?.user?.name}</div>
                <div className="pb-6 text-center mt-2 font-light text-m">
                    Asignaturas
                </div>

                <div className="grid grid-cols-4 gap-4 mx-8">
                    {asignaturas.isLoading && <div className="text-center text-xl font-medium align-middle">Cargando...</div>}
                    {asignaturas.data?.map((asignatura) => (
                        
                        <div className="rounded-md w-full self-auto bg-sky-500 text-white border-2 border-black hover:shadow-gray-400 hover:shadow-md"
                        onClick={() => Router.push("/a/" + asignatura.asignaturaId)}
                        key={asignatura.asignaturaId}
                        >
                            <div className="text-center text-xl font-medium">{asignatura.nombre}</div>
                            <div className="text-center text-sm font-light">Timepo total: {asignatura.tiempoTotal}</div>
                            <div className="text-center text-sm font-light">Tiempo objetivo: {asignatura.timepoObjetivo}</div>


                        </div>
                    ))}

    
                </div>
                <div className="text-center py-4">
                    <button className="text-xl bg-gray-600 rounded-lg text-white px-4" onClick={() => setAnadirAsignatura(false)}>
                        Añadir asignatura
                    </button>

                </div>
            </div>
            </div>
            
            ) : (
                <div className="flex flex-col items-center justify-center min-h-screen py-2 -mt-28 px-14 text-center">
                    <FormularioCrearAsignatura />
                    <div>
                        <button onClick={() => setAnadirAsignatura(true)}>Cerrar</button>
                    </div>
                </div>

            )}
            
        

        </>
    )
}

export async function getServerSideProps(context: any) {
    const session = await getSession(context);
    
    if (!session) {
        return {
            redirect: {
                destination: "/unauth",
                permanent: false,
            },
        };
    }

    return {
        props: {
            session,
        },
    };
}
