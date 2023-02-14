import { Fragment, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { api } from '../utils/api'
import { useSession } from 'next-auth/react'
import DeleteButton from './deleteSubjectModal'
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
            className="inline-flex items-center px-4 py-2"
            onClick={() => setOpen(true)}
        >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 hover:text-black">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.107-1.204l-.527-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>

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
                                            <DeleteButton subjectId={IasignaturaId}/>
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
