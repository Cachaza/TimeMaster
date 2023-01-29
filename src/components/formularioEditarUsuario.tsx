
import { useEffect, useState } from "react"
import "tailwindcss/tailwind.css"

import { getSession , useSession} from "next-auth/react"
import { api } from "../utils/api"

import Image from "next/image";



export type formulario = {
    nombre: string;
    descripcion: string;
    
}

const imageMimeType = /image\/(png|jpg|jpeg)/i;

export const FormularioEditarUsuario = () => {

    const { data: sessionData } = useSession();
    const  descripcion1 = api.example.descripcion.useQuery({ id: sessionData?.user?.id });
    

    const [ file, setfile] = useState(null);
    const [ fileDataUrl, setFileDataUrl ] = useState(null);
    
    const [ setDescripcion ] = useState();
    const [ descripcion ] = useState(descripcion1.data?.descripcion);

    const [ setNombre ] = useState(null);



    const changePhoto = (e: any) => {
        const file = e.target.files[0];
        if (!file.type.match(imageMimeType)) {
            alert("Invalid file type");
            return;
        }
        setfile(file);
    }

    useEffect(() => {
        let fileReader : any, isCancel = false;
        if (file) {
            fileReader = new FileReader();
            fileReader.onload = (e: any) => {
                const { result } = e.target;
                if ( result && !isCancel) {
                    setFileDataUrl(result);
                }
            }
            fileReader.readAsDataURL(file);
        }
        return () => {
            isCancel = true;
            if (fileReader && fileReader.readyState === 1) {
                fileReader.abort();
            }
        }
    }, [file])


    const imagenUsuario = sessionData?.user?.image ?? "/usuario.png";



    async function actualizar(event:any) {
        event.preventDefault();
        //trpc.example.updateDescription.useQuery({ id: sessionData?.user?.id, descripcion: event.target.descripcion.value });
        alert(event.target.descripcion.value);
        
    }

    //const mutate = trpc.example.updateDescription.useQuery({ id: sessionData?.user?.id, descripcion: "" });




return (
    <form className="form" 
    onSubmit={async (event) => {
        await actualizar(event);
    }
    }
    >

                        
                        
              
              
                        <div className="md:space-y-2 mb-3">
                            <div className="flex items-center py-6">
                                <div className="w-12 h-12 mr-4 flex-none rounded-xl border overflow-hidden">
                                    <Image className="w-12 h-12 mr-4 object-cover" src={fileDataUrl ?? imagenUsuario} width="1000" height="1000" placeholder="blur" blurDataURL="https://images.squarespace-cdn.com/content/v1/5ccc49ee348cd92c42de2bb7/1614191616274-GDEYW4J7O7QNJ0ICAP17/Kim+Wood+Placeholder+Image.png" alt="Avatar Upload"></Image>
                                </div>
                                <label className="cursor-pointer ">
                                    <span className="focus:outline-none text-white text-m py-2 px-4 rounded-full bg-green-400 hover:bg-green-500 hover:shadow-lg">Browse</span>
                                    <input type="file" className="hidden" id="image"  accept=".png, .jpg, .jpeg" onChange={changePhoto} ></input>
                                    
                                </label>
                            </div>
                        </div>
                        <div className="md:flex flex-row md:space-x-4 w-full text-xs">
                            <div className="mb-3 space-y-2 w-full text-xs">
                                <label className="font-semibold text-gray-200 py-2">Nombre <abbr title="required">*</abbr></label>
                                <input defaultValue={sessionData?.user?.name ?? "Nombre de usuario"} className="appearance-none block w-full bg-grey-lighter text-black border border-grey-lighter rounded-lg h-10 px-4"  
                                type="text" name="nombre" id="nombre"/>
                                <p className="text-red text-xs hidden">Please fill out this field.</p>
                            </div>
                        </div>
                        <div className="flex-auto w-full mb-1 text-xs space-y-2">
                        <label className="font-semibold text-gray-200 py-2">Descripcion</label>
                            <textarea defaultValue={descripcion1.data?.descripcion}
                            
                            name="descripcion" id="descripcion" className="w-full min-h-[100px] max-h-[300px] h-28 appearance-none block bg-grey-lighter text-black border border-grey-lighter rounded-lg  py-4 px-4" ></textarea>
                            </div>
                        <div className="mt-5 text-right md:space-x-3 md:block flex flex-col-reverse">
                            <button  className="mb-2 md:mb-0 bg-green-400 px-5 py-2 text-sm shadow-sm font-medium tracking-wider text-white rounded-full hover:shadow-lg hover:bg-green-500"
                            type="submit"
                            >Save</button>
                            
                        </div>
                    </form>
)


}