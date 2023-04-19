import { type NextPage } from "next";
import Head from "next/head";
import { signIn, getSession } from "next-auth/react";
import Navbar from "../components/navbar";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import Link from "next/link";


const Home: NextPage = () => {


    return (
      <>
        <Head>
          <title>Inicio</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Navbar />
        <main className="container flex flex-col items-center justify-center min-h-screen p-4 mx-auto -mt-20">        
          <div className="text-4xl text-white">
            Bienvenido a la prueba
          </div>
          {/* 
          Buen ejemplo para coger info de la base de datos
          <div className="flex items-center justify-center w-full pt-6 text-2xl text-blue-500">
            <p>{hello.data ? hello.data.name : "Loading..."}</p>
          </div>
          */}
          <div className="pb-5 text-xl text-white">
            Por favor inicia session
          </div>
          <Link
            className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
            href={"/login"}
          >
            Iniciar sesion
          </Link>
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
