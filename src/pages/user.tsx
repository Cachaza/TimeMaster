import Navbar from "../components/navbar";
import "tailwindcss/tailwind.css";

import Head from "next/head";

import { getSession, useSession } from "next-auth/react";
import AddButton from "../components/addSubjectModal";
import { api } from "../utils/api";
import SubjectCard from "../components/subjectCard";
import type { GetServerSideProps, GetServerSidePropsContext } from "next";
import Image from "next/image";

export default function User() {
  const { data: sessionData, status } = useSession();

  if (status === "loading") {
    return (
      <>
        <Navbar />
        <div className="-mt-28 flex min-h-screen flex-col items-center justify-center py-2 px-14 text-center">
          <h1 className="text-4xl font-bold">Inicio de sesion</h1>
          <p className="mt-3 text-2xl">Cargando...</p>
        </div>
      </>
    );
  }
  const asignaturas = api.asignaturas.getAsignaturas2.useQuery();
  asignaturas.data?.sort((a, b) => a.name.localeCompare(b.name));

  return (
    <>
      <Head>
        <title>Tablon</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />

      <div className="flex h-screen w-full flex-row items-center justify-center pb-20 font-sans text-black">
        <div className="card mx-auto w-3/4 rounded-xl bg-gray-200 shadow-xl ">
          <Image
            className="mx-auto -mt-20 w-32 rounded-full border-8 border-white"
            src={
              sessionData?.user?.image
                ? sessionData?.user?.image
                : "https://images.squarespace-cdn.com/content/v1/5ccc49ee348cd92c42de2bb7/1614191616274-GDEYW4J7O7QNJ0ICAP17/Kim+Wood+Placeholder+Image.png?format=1000w"
            }
            alt=""
            width={150}
            height={150}
          ></Image>
          <div className="mt-2 text-center text-3xl font-medium">
            {sessionData?.user?.name}
          </div>
          <div className="text-m mt-2 pb-6 text-center font-light">
            Asignaturas
          </div>

          <div className="mx-8 grid auto-cols-auto grid-cols-8 gap-4">
            {asignaturas.isLoading && (
              <div className="text-center align-middle text-xl font-medium">
                Cargando...
              </div>
            )}
            {asignaturas.data?.map((asignatura) => (
              <SubjectCard
                asignaturaId={asignatura.subjectId}
                nombre={asignatura.name}
                tiempoObjetivo={asignatura.timeObjetive ?? 0}
                tiempoTotal={asignatura.totalTime ?? 0}
                key={asignatura.subjectId}
              />
            ))}
          </div>
          <div className="py-4 text-center">
            <AddButton />
          </div>
        </div>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/unauth",
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
