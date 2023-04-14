import { GetServerSideProps, GetServerSidePropsContext, type NextPage } from "next";
import Head from "next/head";
import {  getSession } from "next-auth/react";
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
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg aria-hidden="true" className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"></path></svg>
            </div>
            <input type="date" value={startDate.toISOString().substr(0, 10)} onChange={(event) => setStartDate(new Date(event.target.value))} className=" text-sm rounded-lg block w-full pl-10 p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" placeholder="Select date" />
          </div>
            <div className="relative max-w-sm">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg aria-hidden="true" className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"></path></svg>
            </div>
            <input type="date" value={endDate.toISOString().substr(0, 10)} onChange={(event) => setEndDate(new Date(event.target.value))} className=" text-sm rounded-lg block w-full pl-10 p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" placeholder="Select date" />
            </div>

      </div>

      <div className="">
             <div className="">
                <div className="pb-6 text-center mt-2 font-light text-m">
                    Asignaturas
                </div>

                <div className="grid grid-cols-3 gap-10 mx-8 auto-cols-auto">
                    {asignaturas.isLoading && <div className="text-center text-xl font-medium align-middle">Cargando...</div>}
                    {asignaturas.data?.map((asignatura) => (
                        
                        <SubjectChart subjectId={asignatura.subjectId} startDate={startDate} endDate={endDate} subjectName={asignatura.name} key={asignatura.subjectId}/>
                        ))}

                </div>

            </div>
            </div>




      


          
          
          


      </main>
    </>
  );
};

export default Dashboard;


export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
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
