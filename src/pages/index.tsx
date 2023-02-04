import { type NextPage } from "next";
import Head from "next/head";
import { signIn, getSession } from "next-auth/react";
import Navbar from "../components/navbar";
import { GetServerSideProps, GetServerSidePropsContext } from "next";


const Home: NextPage = () => {


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
  
  
};

export default Home;


export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
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
