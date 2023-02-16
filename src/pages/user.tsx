import Navbar from "../components/navbar"
import { useState } from "react"
import "tailwindcss/tailwind.css"

import Head from "next/head";


import { getSession , useSession} from "next-auth/react"
import AddButton from "../components/addSubjectModal";
import { api } from "../utils/api"
import SubjectCard from "../components/subjectCard";
import { GetServerSideProps, GetServerSidePropsContext } from "next";


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
        <Head>
            <title>Tablon</title>
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <Navbar />

        <div className="pb-20 font-sans h-screen w-full flex flex-row justify-center items-center text-black">
             <div className="card w-3/4 mx-auto bg-gray-200  shadow-xl rounded-xl ">
                <img className="w-32 mx-auto rounded-full -mt-20 border-8 border-white" src={sessionData?.user?.image ? sessionData?.user?.image : "https://images.squarespace-cdn.com/content/v1/5ccc49ee348cd92c42de2bb7/1614191616274-GDEYW4J7O7QNJ0ICAP17/Kim+Wood+Placeholder+Image.png?format=1000w" } alt=""></img>
                <div className="text-center mt-2 text-3xl font-medium">{sessionData?.user?.name}</div>
                <div className="pb-6 text-center mt-2 font-light text-m">
                    Asignaturas
                </div>

                <div className="grid grid-cols-12 gap-4 mx-8 auto-cols-auto">
                    {asignaturas.isLoading && <div className="text-center text-xl font-medium align-middle">Cargando...</div>}
                    {asignaturas.data?.map((asignatura) => (
                        
                        <SubjectCard asignaturaId={asignatura.subjectId} nombre={asignatura.name} tiempoObjetivo={asignatura.timeObjetive ?? 0} tiempoTotal={asignatura.totalTime ?? 0} key={asignatura.subjectId} />
                    ))}

                </div>
                <div className="text-center py-4">
                    <AddButton />
                </div>
            </div>
            </div>

        </>
    )
}

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
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
