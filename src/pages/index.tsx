import { type NextPage } from "next";
import Head from "next/head";
import { getSession } from "next-auth/react";
import Navbar from "../components/navbar";
import type { GetServerSideProps, GetServerSidePropsContext } from "next";
import Link from "next/link";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Inicio</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <main className="container mx-auto -mt-20 flex min-h-screen flex-col items-center justify-center p-4">
        <div className="text-4xl text-white">Bienvenido a TimeMaster</div>
        <div className="pb-5 text-xl text-white">Para continuar, por favor inicia session</div>
        <Link
          className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
          href={"/login"}
        >
          Iniciar sesion
        </Link>
      </main>
    </>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
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
};
