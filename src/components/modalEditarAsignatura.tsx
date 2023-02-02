import { Fragment, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { api } from '../utils/api'
import { useSession } from 'next-auth/react'
import DeleteButton from './modalEliminarAsignatura'
import ReactSlider from 'react-slider'


interface Asignatura {
    Inombre: string;
    ItiempoTrabajo: number;
    ItiempoDescanso: number;
    ItiempoObjetivo: number;
    IasignaturaId: string;
}


const EditarAsignatura: React.FC<Asignatura> = ({Inombre, ItiempoTrabajo, ItiempoDescanso, ItiempoObjetivo, IasignaturaId}) => {
  const [open, setOpen] = useState(false)
  const cancelButtonRef = useRef(null)

  
  const { data: sessionData } = useSession();
  const [nombre, setNombre] = useState(Inombre);
  const [tiempoTrabajo, setTiempoTrabajo] = useState(ItiempoTrabajo ?? 25);
  const [tiempoDescanso, setTiempoDescanso] = useState(ItiempoDescanso ?? 5);
  const [timepoObjetivo, setTimepoObjetivo] = useState(ItiempoObjetivo ?? 0);
  const editar = api.asignaturas.modificarAsignatura.useMutation();


  return (
    <>
        <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none "
            onClick={() => setOpen(true)}
        >
            Editar
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
                        Editar asignatura
                      </Dialog.Title>
                      <div className="mt-2">
                      <form onSubmit={async (e) => {
                            e.preventDefault()
                            await editar.mutateAsync({
                                nombre: nombre,
                                tiempoTrabajo: tiempoTrabajo,
                                tiempoDescanso: tiempoDescanso,
                                tiempoObjetivo: timepoObjetivo,
                                id: sessionData?.user?.id,
                                asignaturaId: IasignaturaId

                            })
                            window.location.reload();

                                        
                        }}>
                            <div className="flex flex-col items-center justify-center py-2 px-14 text-center text-black">
                                <p className="p-1 text-xl">Nombre</p>
                                <div className="pt-3">
                                    <input
                                        type="text"
                                        placeholder="Nombre"
                                        value={nombre}
                                        onChange={(e) => setNombre(e.target.value)}
                                        className="p-1 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500, text-black"
                                    />
                                    <p className="p-1 text-xl">Tiempo de trabajo</p>
                                    <input 
                                        type="number" 
                                        placeholder="25"
                                        value={tiempoTrabajo}
                                        onChange={(e) => setTiempoTrabajo(parseInt(e.target.value))}
                                        className="p-1 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500, text-black"
                                    />
                                    <p className="p-1 text-xl">Tiempo de descanso</p>
                                    <input
                                        type="number"
                                        placeholder="5"
                                        value={tiempoDescanso}
                                        onChange={(e) => setTiempoDescanso(parseInt(e.target.value))}
                                        className="p-1 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500, text-black"
                                    />
                                    <p className="p-1 text-xl">Tiempo objetivo</p>
                                    <input
                                        type="number"
                                        placeholder="0"
                                        value={timepoObjetivo}
                                        onChange={(e) => setTimepoObjetivo(parseInt(e.target.value))}
                                        className="p-1 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500, text-black"
                                    />
                                    </div>
                                    <div className="px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                        <div className="p-3">
                                        <button
                                            type="submit"
                                            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                            >
                                            Actualizar
                                        </button>
                                        </div>
                                        <div className="p-3">
                                            <DeleteButton asignaturaId={IasignaturaId}/>
                                        </div>
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

export default EditarAsignatura
