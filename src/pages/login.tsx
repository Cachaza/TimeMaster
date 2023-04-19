import Navbar from "../components/navbar";
import "tailwindcss/tailwind.css";
import Head from "next/head";

import { signIn, getSession, useSession } from "next-auth/react";
import type { GetServerSidePropsContext } from "next";
import Image from "next/image";

export default function Login() {
  const { data: sessionData } = useSession();

  if (sessionData) {
    return (
      <>
        <Navbar />
        <div className="-mt-28 flex min-h-screen flex-col items-center justify-center py-2 px-14 text-center">
          <h1 className="text-4xl font-bold">Inicio de sesion</h1>
          <p className="mt-3 text-2xl">
            You are signed in as {sessionData?.user?.name}
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Login</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <div className="text- -mt-28 flex min-h-screen flex-col items-center justify-center py-2 px-14">
        <h1 className="text-4xl font-bold">Inicio de sesion</h1>
        <p className="mt-3 pb-5 text-2xl">
          Elije el proveedor que desees para iniciar sesion
        </p>
        <div className="flex flex-col items-center rounded-xl bg-white p-5">
          <div className="flex flex-col p-2">
            <div>
              <button
                onClick={() => void signIn("discord")}
                className="rounded-md bg-blue-500 p-4 py-2 text-white hover:bg-blue-600"
              >
                Sign in with Discord
                <Image
                  src="https://cdn-icons-png.flaticon.com/512/2111/2111370.png"
                  className="ml-2 inline h-6 w-6"
                  alt=""
                  width={10}
                  height={10}
                />
              </button>
            </div>
            <div className="pt-2">
              <button
                onClick={() => void signIn("google")}
                className="rounded-md bg-red-500 p-4 py-2 text-white hover:bg-red-600 "
              >
                Sign in with Google
                <Image
                  src="https://cdn-icons-png.flaticon.com/512/281/281764.png"
                  className="ml-2 inline h-6 w-6"
                  alt=""
                  width={10}
                  height={10}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
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
