import { type NextPage } from "next";
import Head from "next/head";
import { signIn, signOut, useSession } from "next-auth/react";
import Navbar from "../components/navbar";


import {useState} from "react";
import Pomodoro from '../components/pomodoro';



import { api } from "../utils/api";

const Home: NextPage = () => {
  const { data: sessionData, status } = useSession();
  const hello = api.example.nombre.useQuery({ id: sessionData?.user?.id });
  const [showSettings, setShowSettings] = useState(false);

  if (!sessionData){
    return (
      <>
        <Head>
          <title>Inicio</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Navbar />
        <main className="-mt-20 container mx-auto flex min-h-screen flex-col items-center justify-center p-4">        
          <div className="text-4xl text-white">
            Bienvenido a la prueba
          </div>
          {/* 
          Buen ejemplo para coger info de la base de datos
          <div className="flex w-full items-center justify-center pt-6 text-2xl text-blue-500">
            <p>{hello.data ? hello.data.name : "Loading..."}</p>
          </div>
          */}
          <div className="text-xl text-white pb-5">
            Por favor inicia session
          </div>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => signIn()}
          >
            Iniciar sesion
          </button>
        </main>
      </>
    );
  } else {
    

    return (
      <>
        <Head>
          <title>Inicio</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Navbar />
        <main className="-mt-20 container mx-auto flex min-h-screen flex-col items-center justify-center p-4">        
          <div className="text-4xl text-white">
            Bienvenido a la prueba
          </div>
          {/* 
          Buen ejemplo para coger info de la base de datos
          <div className="flex w-full items-center justify-center pt-6 text-2xl text-blue-500">
            <p>{hello.data ? hello.data.name : "Loading..."}</p>
          </div>
          */}
          <Pomodoro workTime={25} breakTime={5} />

          
          

          
        </main>
      </>
    );
  }
};

export default Home;



