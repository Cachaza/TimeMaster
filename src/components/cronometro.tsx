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
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  const [isPaused, setIsPaused] = useState(true);


  const tiempo = api.asignaturas.añadirTiempo.useMutation();
  const { data: sessionData } = useSession();
  const getTiempos = api.asignaturas.getTiempos.useQuery({ id: sessionData?.user.id, asignaturaId: asignaturaId });
  const actualizarTiempoTotalBase = api.asignaturas.actualizarTiempoTotal.useMutation();


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

  async function finalizarTiempo() {
      await addTime(minutes);
      await actualizarTiempoTotal(minutes);
      Router.push('/user');
         
  }







  


  useEffect(() => {
    let interval = setInterval(() => {
      clearInterval(interval);

      if (isPaused) {
        return;
      }
      
      if (seconds === 59) {
          setSeconds(0);
          setMinutes(minutes + 1);     
      } else {
        setSeconds(seconds + 1);
      }
    }, 1000);
  }, [seconds, isPaused]);

  let totalSeconds = minutes * 60 + seconds;
  const elapsedSeconds = seconds + minutes * 60;
  const percentage = (seconds / 60) * 100;

  const timerMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const timerSeconds = seconds < 10 ? `0${seconds}` : seconds;



  const handleStartStopClick = () => {
    setIsPaused(!isPaused);
  };




  return (
    <div className="pomodoro text-center columns-sm">
      <div className="text-3xl pb-6">
        <h1>Trabajo</h1>
      </div>
      <div className="timer">
        <CircularProgressbarWithChildren
          value={percentage}
          text={timerMinutes + ':' + timerSeconds}
          styles={buildStyles({
            textColor: "#fff",
            pathColor: "#fff",
            trailColor: "transparent",
          })}
        />
      </div>
      <div className="buttons pt-5">
        <button
          className="btn btn-primary pr-2 font-bold text-center"
          onClick={handleStartStopClick}
        >
          {isPaused ? "Iniciar" : "Pausar"}
        </button>
        <button
          className="btn btn-primary pl-2 font-bold text-center"
          onClick={finalizarTiempo}
        >
          Finalizar
        </button>
        
      </div>
      
    </div>
  );
};

export default Cronometro;