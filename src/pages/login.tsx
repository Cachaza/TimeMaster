import Navbar from "../components/navbar"
import "tailwindcss/tailwind.css"
import Head from "next/head";

import {  signIn,  getSession , useSession} from "next-auth/react"
import { GetServerSidePropsContext } from "next";
import Image from "next/image";




export default function Login() {
  const { data: sessionData } = useSession();


  async function loginGoogle() {
    try {
      await signIn("google")
    } catch (error) {
      console.log(error)
    }
  }

  async function loginDiscord() {
    try {
      await signIn("discord")
    } catch (error) {
      console.log(error)
    }
  }


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
      <Head>
          <title>Login</title>
          <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen py-2 -mt-28 px-14 text-">
        <h1 className="text-4xl font-bold">Inicio de sesion</h1>
        <p className="mt-3 text-2xl pb-5">Elije el proveedor que desees para iniciar sesion</p>
        <div className=" flex flex-col items-center p-5 bg-white rounded-xl">
          
          <div className="p-2 flex flex-col">
            <div>
              <button
                onClick={() => void signIn("discord")}
                className=" p-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 "
              >
                Sign in with Discord<Image src="https://cdn-icons-png.flaticon.com/512/2111/2111370.png" className="inline w-6 h-6 ml-2"  alt="" width={10} height={10}/>
              </button>
            </div>
            <div className="pt-2">
              <button
                onClick={() => void signIn("google")}
                className="p-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600 "
              >
                Sign in with Google<Image src="https://cdn-icons-png.flaticon.com/512/281/281764.png" className="inline w-6 h-6 ml-2" alt="" width={10} height={10}/>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
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
