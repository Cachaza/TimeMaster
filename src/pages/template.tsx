import Navbar from "../components/navbar"
import Link from "next/link"
import FormularioCrearAsignatura from "../components/crearAsignatura"

export default function noLogin() {



    return(
        <>
            
            <Navbar />
            <div className="flex flex-col items-center justify-center min-h-screen py-2 -mt-28 px-14 text-center">



                <FormularioCrearAsignatura />

            </div>
          </>
        
    )
}