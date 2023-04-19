import Link from "next/link";

interface Asignatura {
  nombre: string;
  asignaturaId: string;
  tiempoObjetivo: number;
  tiempoTotal: number;
}

const SubjectCard: React.FC<Asignatura> = ({
  nombre,
  asignaturaId,
  tiempoObjetivo,
  tiempoTotal,
}) => {
  function pasarHoraOMinutos(tiempo: number) {
    if (tiempo >= 60) {
      let hours = tiempo / 60;
      hours = Math.floor(hours);
      const minutes = tiempo % 60;
      return String(hours) + "h " + String(minutes) + "min";
    } else {
      return String(tiempo) + " minutos";
    }
  }

  const tiempoFinal = pasarHoraOMinutos(tiempoTotal);

  return (
    <Link
      className="static col-span-2 flex flex-col items-center overflow-hidden rounded-lg border border-gray-700 bg-gray-800 hover:bg-gray-700 md:max-w-xl md:flex-row"
      href={"/a/" + asignaturaId}
      key={asignaturaId}
    >
      <div className="flex w-full flex-col">
        <div className="flex flex-col justify-between p-4 leading-normal">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-white">
            {nombre}
          </h5>
          <p className="mb-3 font-normal text-gray-400">{tiempoFinal}</p>
        </div>
        <div className="h-1 w-full bg-neutral-600">
          <div
            className="h-1 bg-blue-800"
            style={{
              width: String((tiempoTotal * 100) / (tiempoObjetivo * 60)) + "%",
            }}
          ></div>
        </div>
      </div>
    </Link>
  );
};

export default SubjectCard;
