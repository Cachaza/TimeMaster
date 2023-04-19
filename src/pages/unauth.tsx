import Navbar from "../components/navbar";
import Link from "next/link";
import Head from "next/head";

export default function noLogin() {
  return (
    <>
      <Head>
        <title>Area restringida</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />
      <div className="-mt-28 flex min-h-screen flex-col items-center justify-center py-2 px-14 text-center">
        <h1 className="text-4xl font-bold">Area restringida!</h1>
        <p className="mt-3 text-2xl">
          Por favor inicia sesion para ver esta pagina
        </p>
        <div className="pt-6">
          <button className="rounded-md bg-blue-500 p-4 py-2 text-white hover:bg-blue-600 ">
            <Link href="/login">Iniciar sesion</Link>
          </button>
        </div>
      </div>
    </>
  );
}
