import Router, { useRouter } from "next/router";
import { api } from "../../utils/api";

import { getSession, useSession } from "next-auth/react";
import { useState } from "react";

import Head from "next/head";
import type { GetServerSidePropsContext } from "next";
import Link from "next/link";

import Player from "../../components/player";
import Pomodoro from "../../components/pomodoro";
import Chronometer from "../../components/chronometer";
import Navbar from "../../components/navbar";
import EditarAsignatura from "../../components/editSubjectModal";

const Asignatura = () => {
  const id = useRouter().query.id;
  const { data: sessionData } = useSession();
  const [openTab, setOpenTab] = useState(2);
  const { data: asignatura } = api.asignaturas.getAsignatura.useQuery({
    subjectId: String(id),
  });
  const { data: youtube } = api.asignaturas.getSubjectSong.useQuery({
    subjectId: String(id),
  });

  const exists = api.asignaturas.checkIfSubjectExists.useQuery({
    id: sessionData?.user?.id,
    subjectId: String(id),
  });

  if (!exists.isLoading) {
    if (exists.data === false) {
      return (
        <>
          <Head>
            <title>No encontrado</title>
            <link rel="icon" href="/favicon.ico" />
          </Head>

          <Navbar />
          <div className="-mt-28 flex min-h-screen flex-col items-center justify-center py-2 px-14 text-center">
            <h1 className="text-4xl font-bold">Asignatura no encontrada!</h1>
            <p className="mt-3 text-2xl">
              No se ha podido encontrar la asignatura que buscas, o no te
              pertenece
            </p>
            <div className="pt-6">
              <div className="rounded-md bg-blue-500 p-4 py-2 text-white hover:bg-blue-600 ">
                <Link href="/user">Volver atras</Link>
              </div>
            </div>
          </div>
        </>
      );
    }
  }

  if (!asignatura) {
    return (
      <>
        <Head>
          <title>Cargando...</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <Navbar />
        <div className="-mt-28 flex min-h-screen flex-col items-center justify-center py-2 px-14 text-center">
          <h1 className="text-4xl font-bold">Cargando...</h1>
        </div>
      </>
    );
  }

  const ind = asignatura.subjects[0];
  const nombre = asignatura.subjects[0]?.name;

  return (
    <>
      <Head>
        <title>{nombre}</title>
      </Head>

      <Navbar />
      <div className="static">
        <div className="flex flex-col items-center justify-center py-2 px-14 text-center">
          <h1 className="text-4xl font-bold">{nombre}</h1>
        </div>
        <div className="flex flex-wrap">
          <div className="w-full">
            <div className=" mx-auto flex items-center justify-center pt-4">
              <a
                className={
                  "text-s px-5 py-3 font-bold uppercase " +
                  (openTab === 2 ? "text-white " : "text-gray-500")
                }
                onClick={(e) => {
                  e.preventDefault();
                  setOpenTab(2);
                }}
                href="#"
              >
                Pomodoro
              </a>
              <a
                className={
                  "text-s px-5 py-3 font-bold uppercase " +
                  (openTab === 1 ? "text-white " : "text-gray-500")
                }
                onClick={(e) => {
                  e.preventDefault();
                  setOpenTab(1);
                }}
                href="#"
              >
                Cronometro
              </a>
            </div>
            <div className="container mx-auto flex flex-col items-center justify-center p-4">
              <div className="flex-auto px-4 py-5">
                <div className="tab-content tab-space">
                  <div className={openTab === 1 ? "block" : "hidden"}>
                    <Chronometer subjectId={String(id)} />
                  </div>
                  <div className={openTab === 2 ? "block" : "hidden"}>
                    <Pomodoro
                      workTime={ind?.workingTime ?? 25}
                      breakTime={ind?.restTime ?? 5}
                      asignaturaId={String(id)}
                    />
                    <div className="container mx-auto flex flex-col items-center justify-center p-4">
                      <EditarAsignatura
                        Inombre={ind?.name ?? "No definido"}
                        ItiempoTrabajo={ind?.workingTime ?? 25}
                        ItiempoDescanso={ind?.restTime ?? 5}
                        ItiempoObjetivo={ind?.timeObjetive ?? 0}
                        IasignaturaId={String(id)}
                        videoUrl={
                          youtube?.song ??
                          "https://www.youtube.com/watch?v=QH2-TGUlwu4"
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute top-20 left-10">
        <button onClick={() => Router.back()}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="round-lg h-6 w-6 hover:text-gray-500 "
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
            />
          </svg>
        </button>
      </div>
      <div className="absolute bottom-10 left-10">
        {/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */}
        <Player
          youtube={
            youtube?.song ?? "https://www.youtube.com/watch?v=QH2-TGUlwu4"
          }
        />
      </div>
    </>
  );
};

export default Asignatura;

export async function getServerSideProps(context: GetServerSidePropsContext) {
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
}
