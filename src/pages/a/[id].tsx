import Router, {useRouter} from "next/router";
import { api } from "../../utils/api";
import Pomodoro from "../../components/pomodoro";

import { getSession , useSession} from "next-auth/react"
import { useState } from "react"
import "tailwindcss/tailwind.css"
import Navbar from "../../components/navbar";


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
        <div className="flex flex-col items-center justify-center py-2 px-14 text-center">
            <h1 className="text-4xl font-bold">{nombre}</h1>
        </div>
        <div className="container mx-auto flex flex-col items-center justify-center p-4">
            <Pomodoro workTime={ind?.tiempoTrabajo ?? 25} breakTime={ind?.tiempoDescanso ?? 5} />

        </div>



        
        </>


    )

    }

export default Asignatura;
