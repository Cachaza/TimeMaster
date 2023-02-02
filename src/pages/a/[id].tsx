import Router, {useRouter} from "next/router";
import { api } from "../../utils/api";
import Pomodoro from "../../components/pomodoro";

import { getSession , useSession} from "next-auth/react"
import { useState } from "react"
import "tailwindcss/tailwind.css"
import Navbar from "../../components/navbar";

import EditarAsignatura from "../../components/modalEditarAsignatura";

const Asignatura = () => {
    const id = useRouter().query.id;

    const { data: sessionData } = useSession();
    const {data: asignatura} = api.asignaturas.getAsignatura.useQuery({id: sessionData?.user?.id, asignaturaId: String(id)});

    
    
    if (!asignatura) {
        return <div>Cargando...</div>
    }

    const ind = asignatura.asignaturas[0];
    const nombre = asignatura.asignaturas[0]?.nombre;
    
    

    return(
        <>
        <Navbar />
        <div>

        
            <div className="flex flex-col items-center justify-center py-2 px-14 text-center">
                <h1 className="text-4xl font-bold">{nombre}</h1>
            </div>
            <div className="container mx-auto flex flex-col items-center justify-center p-4">
                <Pomodoro workTime={ind?.tiempoTrabajo ?? 25} breakTime={ind?.tiempoDescanso ?? 5} asignaturaId={String(id)} />
            </div>
            

            <EditarAsignatura Inombre={ind?.nombre ?? "No definido"} ItiempoTrabajo={ind?.tiempoTrabajo ?? 25} ItiempoDescanso={ind?.tiempoDescanso ?? 5} ItiempoObjetivo={ind?.timepoObjetivo ?? 0} IasignaturaId={String(id)} />


            </div>

            
            <button onClick={() => Router.back()}>
                Atras
            </button>

        </>


    )

    }

export default Asignatura;


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
