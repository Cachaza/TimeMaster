import Navbar from "../components/navbar"
import { useState } from "react"
import "tailwindcss/tailwind.css"

import { getProviders, signIn, getCsrfToken, getSession , useSession} from "next-auth/react"




export default function Login({ getProviders, getSession, getCsrfToken }: any) {
  const { data: sessionData } = useSession();
  const [error, setError] = useState()




  if (sessionData) {
    return (
      <>
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-screen py-2 -mt-28 px-14 text-center">
          <h1 className="text-4xl font-bold">Inicio de sesion</h1>
          <p className="mt-3 text-2xl">You are signed in as {sessionData?.user?.name}
          </p>
        </div>
      </>
    )
  }

  return (
    <>

      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen py-2 -mt-28 px-14 text-">
        <h1 className="text-4xl font-bold">Inicio de sesion</h1>
        <p className="mt-3 text-2xl pb-5">You are not signed in</p>
        <div className=" flex flex-col items-center p-5 bg-white rounded-xl">
          
          <div className="p-2">
            <button
            onClick={() => signIn("discord")}
            className=" p-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 "
            >
            Sign in with Discord<img src="https://cdn-icons-png.flaticon.com/512/2111/2111370.png" className="inline w-6 h-6 ml-2" />
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export async function getServerSideProps(context: any) {
  const session = await getSession(context);
  
  if (session) {
      return {
          redirect: {
              destination: "/user",
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
