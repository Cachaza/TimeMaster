import type { GetServerSideProps, GetServerSidePropsContext } from "next";
import { type NextPage } from "next";
import Head from "next/head";
import { getSession } from "next-auth/react";
import Navbar from "../components/navbar";
import { api } from "../utils/api";

import SubjectChart from "../components/subjectChart";
import { useState } from "react";

const today = new Date();
const lastWeek = new Date();
lastWeek.setTime(today.getTime() - 7 * 24 * 60 * 60 * 1000);
const lastMonth = new Date();
lastMonth.setTime(today.getTime() - 30 * 24 * 60 * 60 * 1000);

const Dashboard: NextPage = () => {
  const [startDate, setStartDate] = useState(lastWeek);
  const [endDate, setEndDate] = useState(new Date(today));

  const asignaturas = api.asignaturas.getAsignaturas2.useQuery();
  asignaturas.data?.sort((a, b) => a.name.localeCompare(b.name));

  return (
    <>
      <Head>
        <title>Dashboard</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <main className="">
        <div className="flex space-x-4">
          <div className="relative max-w-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <svg
                aria-hidden="true"
                className="h-5 w-5 text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </div>
            <input
              type="date"
              value={startDate.toISOString().substr(0, 10)}
              onChange={(event) => setStartDate(new Date(event.target.value))}
              className=" block w-full rounded-lg border-gray-600 bg-gray-700 p-2.5 pl-10 text-sm text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
              placeholder="Select date"
            />
          </div>
          <div className="relative max-w-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <svg
                aria-hidden="true"
                className="h-5 w-5 text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </div>
            <input
              type="date"
              value={endDate.toISOString().substr(0, 10)}
              onChange={(event) => setEndDate(new Date(event.target.value))}
              className=" block w-full rounded-lg border-gray-600 bg-gray-700 p-2.5 pl-10 text-sm text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
              placeholder="Select date"
            />
          </div>
        </div>

        <div className="">
          <div className="">
            <div className="text-m mt-2 pb-6 text-center font-light">
              Asignaturas
            </div>

            <div className="mx-8 grid auto-cols-auto grid-cols-3 gap-10">
              {asignaturas.isLoading && (
                <div className="text-center align-middle text-xl font-medium">
                  <div className="container mx-auto -mt-20 flex min-h-screen flex-col items-center justify-center p-4">
                    <svg
                      aria-hidden="true"
                      className="mr-2 h-8 w-8 animate-spin fill-blue-600 text-gray-200 dark:text-gray-600"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                    <span className="sr-only">Loading...</span>
                  </div>
                </div>
              )}
              {asignaturas.data?.map((asignatura) => (
                <SubjectChart
                  subjectId={asignatura.subjectId}
                  startDate={startDate}
                  endDate={endDate}
                  subjectName={asignatura.name}
                  key={asignatura.subjectId}
                />
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Dashboard;

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
