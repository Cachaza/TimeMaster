import Navbar from "../components/navbar"
import "tailwindcss/tailwind.css"

import Head from "next/head";


import { getSession , useSession} from "next-auth/react"
import AddButton from "../components/addSubjectModal";
import { api } from "../utils/api"
import SubjectCard from "../components/subjectCard";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import Image from "next/image";


export default function User(){
    const { data: sessionData, status } = useSession();

    if (status === "loading") {
        return (
            <>
                <Navbar />
                <div className="flex flex-col items-center justify-center min-h-screen py-2 text-center -mt-28 px-14">
                    <h1 className="text-4xl font-bold">Inicio de sesion</h1>
                    <p className="mt-3 text-2xl">Cargando...</p>
                </div>
            </>
        )
    }
    const asignaturas = api.asignaturas.getAsignaturas2.useQuery();
    asignaturas.data?.sort((a, b) => a.name.localeCompare(b.name));


    return (
        <>
        <Head>
            <title>Tablon</title>
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <Navbar />

        <div className="flex flex-row items-center justify-center w-full h-screen pb-20 font-sans text-black">
             <div className="w-3/4 mx-auto bg-gray-200 shadow-xl card rounded-xl ">
                <Image className="w-32 mx-auto -mt-20 border-8 border-white rounded-full" src={sessionData?.user?.image ? sessionData?.user?.image : "https://images.squarespace-cdn.com/content/v1/5ccc49ee348cd92c42de2bb7/1614191616274-GDEYW4J7O7QNJ0ICAP17/Kim+Wood+Placeholder+Image.png?format=1000w" } alt="" width={150} height={150}></Image>
                <div className="mt-2 text-3xl font-medium text-center">{sessionData?.user?.name}</div>
                <div className="pb-6 mt-2 font-light text-center text-m">
                    Asignaturas
                </div>

                <div className="grid grid-cols-8 gap-4 mx-8 auto-cols-auto">
                    {asignaturas.isLoading && <div className="text-xl font-medium text-center align-middle">Cargando...</div>}
                    {asignaturas.data?.map((asignatura) => (
                        
                        <SubjectCard asignaturaId={asignatura.subjectId} nombre={asignatura.name} tiempoObjetivo={asignatura.timeObjetive ?? 0} tiempoTotal={asignatura.totalTime ?? 0} key={asignatura.subjectId} />
                    ))}

                </div>
                <div className="py-4 text-center">
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
