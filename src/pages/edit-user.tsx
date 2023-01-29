import Navbar from "../components/navbar"
import { FormularioEditarUsuario } from "../components/formularioEditarUsuario";
import { type NextPage } from "next";
import "tailwindcss/tailwind.css"

import { getSession } from "next-auth/react"


const imageMimeType = /image\/(png|jpg|jpeg)/i;



const NewUser: NextPage = () => {


    
    
    
    return(
        <>
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-screen py-2 -mt-28 px-14 text-center">
            <h1 className="text-4xl font-bold">Edita tu perfil</h1>
            <p className="text-3xl"></p>
            <p className="mt-3 text-2xl"></p>
            <div className="grid  gap-8 grid-cols-1">
            <div className="flex flex-col ">
                <div className="flex flex-col sm:flex-row items-center">
                    <div className="w-full sm:w-auto sm:ml-auto mt-3 sm:mt-0"></div>
                </div>
                <div className="mt-5">
                    <FormularioEditarUsuario />
                    
                </div>
            </div>
            </div> 

        </div>
        </>
    )
}
export default NewUser



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