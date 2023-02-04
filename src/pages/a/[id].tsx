import Router, {useRouter} from "next/router";
import { api } from "../../utils/api";
import Pomodoro from "../../components/pomodoro";
import Cronometro from "../../components/cronometro";

import { getSession , useSession} from "next-auth/react"
import { useState } from "react"
import "tailwindcss/tailwind.css"
import Navbar from "../../components/navbar";

import EditarAsignatura from "../../components/modalEditarAsignatura";



const Asignatura = () => {
    const id = useRouter().query.id;

    const { data: sessionData } = useSession();
    const {data: asignatura} = api.asignaturas.getAsignatura.useQuery({id: sessionData?.user?.id, asignaturaId: String(id)});
    const [openTab, setOpenTab] = useState(2);
    
    
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
            <div className="flex flex-wrap">
                <div className="w-full">
                    <div className=" mx-auto flex items-center justify-center pt-4">
                        <a
                        className={
                            "text-s font-bold uppercase px-5 py-3 " +
                            (openTab === 2
                                ? "text-white "
                                : "text-gray-500")
                        }
                        onClick={(e) => {
                            e.preventDefault();
                            setOpenTab(2);
                        }}
                        href="#"
                        >
                            Pomodoro
                        </a>
                        <a
                        className={
                            "text-s font-bold uppercase px-5 py-3 " +
                            (openTab === 1
                                ? "text-white "
                                : "text-gray-500")
                        }
                        onClick={(e) => {
                            e.preventDefault();
                            setOpenTab(1);
                        }}
                        href="#"
                        >
                        Cronometro
                        </a>
                    </div>
                    <div className="container mx-auto flex flex-col items-center justify-center p-4">
                        <div className="px-4 py-5 flex-auto">
                            <div className="tab-content tab-space">
                            <div className={openTab === 1 ? "block" : "hidden"}>
                                <Cronometro asignaturaId={String(id)} />
                            </div>
                            <div className={openTab === 2 ? "block" : "hidden"}>
                                <Pomodoro workTime={ind?.tiempoTrabajo ?? 25} breakTime={ind?.tiempoDescanso ?? 5} asignaturaId={String(id)} />
                                <div className="container mx-auto flex flex-col items-center justify-center p-4">
                                    <EditarAsignatura Inombre={ind?.nombre ?? "No definido"} ItiempoTrabajo={ind?.tiempoTrabajo ?? 25} ItiempoDescanso={ind?.tiempoDescanso ?? 5} ItiempoObjetivo={ind?.timepoObjetivo ?? 0} IasignaturaId={String(id)} />
                                </div>
                            </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            
            
            

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
