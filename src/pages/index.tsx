import { type NextPage } from "next";
import Head from "next/head";
import { signIn, signOut, useSession } from "next-auth/react";
import Navbar from "../components/navbar";

import { api } from "../utils/api";

const Home: NextPage = () => {
  const { data: sessionData, status } = useSession();
  const hello = api.example.nombre.useQuery({ id: sessionData?.user?.id });

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
        <AuthShowcase />
      </main>
    </>
  );
};

export default Home;

const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession();


  return (
    <div className="flex flex-col items-center justify-center gap-2">
      {sessionData && (
        <p className="text-2xl text-blue-500">
          Logged in as {sessionData?.user?.name}
        </p>
      )}

      <button
        className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded align-baseline"
        onClick={sessionData ? () => signOut() : () => signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
};

