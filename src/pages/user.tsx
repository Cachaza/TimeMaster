import Navbar from "../components/navbar"
import { useState } from "react"
import "tailwindcss/tailwind.css"



import { getSession , useSession} from "next-auth/react"
import { api } from "../utils/api"
import Link from "next/link";

export default function User(){
    const { data: sessionData, status } = useSession();

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
    

    

    
    return (
        <>
        <Navbar />
        <div className="pb-20 font-sans h-screen w-full flex flex-row justify-center items-center text-black">
            <div className="card w-96 mx-auto bg-white  shadow-xl rounded-xl hover:shadow-white hover:shadow-sm">
                <img className="w-32 mx-auto rounded-full -mt-20 border-8 border-white" src={sessionData?.user?.image ? sessionData?.user?.image : "https://images.squarespace-cdn.com/content/v1/5ccc49ee348cd92c42de2bb7/1614191616274-GDEYW4J7O7QNJ0ICAP17/Kim+Wood+Placeholder+Image.png?format=1000w" } alt=""></img>
                <div className="text-center mt-2 text-3xl font-medium">{sessionData?.user?.name}</div>
                <div className="text-center mt-2 font-light text-sm">@{sessionData?.user?.name}</div>
                <div className="px-6 text-center mt-2 font-light text-sm">
                <p>
                    {descripcion.data ? descripcion.data.descripcion : "Loading..."}
                </p>
                </div>

                <div className="flex p-4">
                <div className="w-1/2 text-center">
                    <span className="font-bold">1.8 k</span> Followers
                </div>
                <div className="w-0 border border-gray-300">
                    
                </div>
                <div className="w-1/2 text-center">
                    <span className="font-bold">2.0 k</span> Following
                </div>
                
                </div>
                <div className="text-center pb-4">
                    <Link href="/edit-user" className="text-xl bg-blue-800 rounded-lg text-white px-4">Editar</Link>
                </div>
            </div>
        </div>

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
