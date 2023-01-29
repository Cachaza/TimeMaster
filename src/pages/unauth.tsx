import Navbar from "../components/navbar"
import Link from "next/link"

export default function noLogin() {



    return(
        <>
            
            <Navbar />
            <div className="flex flex-col items-center justify-center min-h-screen py-2 -mt-28 px-14 text-center">
              <h1 className="text-4xl font-bold">Area restringida!</h1>
              <p className="mt-3 text-2xl">Por favor inicia sesion para ver esta pagina</p>
              <div className="pt-6">
              <button className="p-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 ">
                <Link href="/login">Iniciar sesion</Link>
              </button>
              </div>
            </div>
          </>
        
    )
}