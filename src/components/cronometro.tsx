import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import React, { useState, useEffect, useRef } from "react";
import { useSession } from 'next-auth/react'

import { api } from "../utils/api";
import Router from 'next/router';


interface PomodoroProps {
  asignaturaId: string;
}

const Cronometro: React.FC<PomodoroProps> = ({ asignaturaId }) => {

  const [isPaused, setIsPaused] = useState(true);


  const tiempo = api.asignaturas.añadirTiempo.useMutation();
  const { data: sessionData } = useSession();
  const getTiempos = api.asignaturas.getTiempos.useQuery({ id: sessionData?.user.id, asignaturaId: asignaturaId });
  const actualizarTiempoTotalBase = api.asignaturas.actualizarTiempoTotal.useMutation();
  const [referenceTime, setReferenceTime] = useState(Date.now());
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  const [startTime, setStartTime] = useState<number | null>(null);



  async function addTime(tiempoE: number) {
    await tiempo.mutateAsync({
      asignaturaId: asignaturaId,
      id: sessionData?.user?.id,
      tiempo: tiempoE,
      tiempoTotal: tiempoE,
    });
  }

  function getSumaTiempos() {

    if (getTiempos.data) {    
        let suma = 0;     
        for (let i = 0; i < getTiempos.data.length; i++) {
            suma += getTiempos.data[i]?.tiempoTrabajo ?? 0;
        }
        return suma;

    } else {
        return 0;
    }

  }

  async function actualizarTiempoTotal(trabajado: number) {
    const antiguoTiempo = getSumaTiempos();

    await actualizarTiempoTotalBase.mutateAsync({
      asignaturaId: asignaturaId,
      id: sessionData?.user?.id,
      tiempoTotal: antiguoTiempo + trabajado,
    });
       

  }

  useEffect(() => {
    if (!isPaused) {
      const intervalId = setInterval(() => {
        setTimeElapsed(Date.now() - startTime! + timeElapsed);
      }, 10);
      return () => clearInterval(intervalId);
    }
  }, [isPaused, startTime]);

  const handleStart = () => {
    setIsPaused(!isPaused);
    setStartTime(Date.now());
  };

    const seconds = Math.floor(timeElapsed / 1000) % 60;
    const minutes = Math.floor(timeElapsed / (1000 * 60)) % 60;
    const hours = Math.floor(timeElapsed / (1000 * 60 * 60)) % 24;
  
    

  const handleStartStopClick = () => {
    setIsPaused(!isPaused);
  };

  const handleFinish = async () => {
    if (isPaused) {
      setIsPaused(!isPaused);
    }
    
  const tiempoEnMinutos = Math.floor((timeElapsed / 1000) / 60);
    try {
      await actualizarTiempoTotal(tiempoEnMinutos);
      await addTime(tiempoEnMinutos);
      await Router.push('/user');
    } catch (error) {
      console.log(error);
    }
    };




  return (
    <div className="pomodoro text-center columns-sm">
      <div className="text-3xl pb-6">
        <h1>Trabajo</h1>
      </div>
      <div className="timer text-6xl">
      <p>
        {hours.toString().padStart(2, '0')}:
        {minutes.toString().padStart(2, '0')}:
        {seconds.toString().padStart(2, '0')}

      </p>
      </div>
      <div className="buttons pt-5">
        <button
          className="btn btn-primary pr-2 font-bold text-center"
          onClick={isPaused ? handleStart : handleStartStopClick}
        >
          {isPaused ? "Iniciar" : "Pausar"}
        </button>
        <button
          className="btn btn-primary pl-2 font-bold text-center"
          onClick={() => void handleFinish()}
        >
          Finalizar
        </button>
        
      </div>
      
    </div>
  );
};

export default Cronometro;