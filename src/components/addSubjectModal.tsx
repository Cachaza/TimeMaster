import { Fragment, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { api } from '../utils/api'
import { useSession } from 'next-auth/react'




export default function AddButton() {
  const [open, setOpen] = useState(false)
  const crear = api.asignaturas.createAsignatura2.useMutation();
  const [nombre, setNombre] = useState("");
  const cancelButtonRef = useRef(null)

  
  const { data: sessionData } = useSession();


  return (
    <>
        <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none "
            onClick={() => setOpen(true)}
        >
            Añadir asignatura
        </button>

    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                        Añadir asignatura
                      </Dialog.Title>
                      <div className="mt-2">
                        {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
                        <form onSubmit={async (e) => {
                            e.preventDefault()
                            await crear.mutateAsync({
                                nombre: nombre,
                                id: sessionData?.user?.id
                            })
                            window.location.reload();

                                        
                        }}>
                            <div className="flex flex-col items-center justify-center py-2 px-14 text-center">
                                <h1 className="text-4xl font-bold">Crear Asignatura</h1>
                                <p className="mt-3 text-2xl">Por favor ingrese el nombre de la asignatura</p>
                                <div className="pt-6">
                                    <input
                                        required
                                        type="text"
                                        placeholder="Nombre"
                                        value={nombre}
                                        onChange={(e) => setNombre(e.target.value)}
                                        className="p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500, text-black"
                                    />
                                    <button
                                        type="submit"
                                        className="p-2 mt-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
                                    >
                                        Crear
                                    </button>
                                </div>
                            </div>


                        </form>

                      </div>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
    </>
  )
}
