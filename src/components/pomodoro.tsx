import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import React, { useState, useEffect, useRef } from "react";
import { useSession } from 'next-auth/react'

import { api } from "../utils/api";
import Router from 'next/router';


import useSound from 'use-sound';


import ReactSlider from 'react-slider';

interface PomodoroProps {
  workTime: number;
  breakTime: number;
  asignaturaId: string;
}

const Pomodoro: React.FC<PomodoroProps> = ({ workTime, breakTime, asignaturaId }) => {
  const [minutes, setMinutes] = useState(workTime);
  const [seconds, setSeconds] = useState(0);
  const [displayMessage, setDisplayMessage] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  const tiempo = api.asignaturas.añadirTiempo.useMutation();
  const { data: sessionData } = useSession();
  const getTiempos = api.asignaturas.getTiempos.useQuery({ id: sessionData?.user.id, asignaturaId: asignaturaId });
  const actualizarTiempoTotalBase = api.asignaturas.actualizarTiempoTotal.useMutation();


  async function addTime(tiempoE: any, tiempoT: any) {
    await tiempo.mutateAsync({
      asignaturaId: asignaturaId,
      id: sessionData?.user?.id,
      tiempo: tiempoE,
      tiempoTotal: tiempoT + tiempoE,
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
    if(!displayMessage){
      const tiempoEstudiado = workTime - minutes;
      await addTime(tiempoEstudiado, breakTime);
      await actualizarTiempoTotal(tiempoEstudiado);
      Router.push('/user');
      
    }
  }







  


  useEffect(() => {
    let interval = setInterval(() => {
      clearInterval(interval);

      if (isPaused) {
        return;
      }
      
      if (seconds === 0) {
        if (minutes !== 0) {
          setSeconds(59);
          setMinutes(minutes - 1);
        } else {

          // set break
          let minutes = displayMessage ? workTime : breakTime;
          let seconds = 0;

          if (!displayMessage) {
            addTime(workTime, breakTime);
            actualizarTiempoTotal(workTime);

          } 


          let audio = new Audio('https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3');
          audio.play();
                   
          setSeconds(seconds);
          setMinutes(minutes);
          setDisplayMessage(!displayMessage);
        }
      } else {
        setSeconds(seconds - 1);
      }
    }, 1000);
  }, [seconds, isPaused, displayMessage]);

  let totalSeconds = displayMessage ? breakTime * 60 : workTime * 60;
  const elapsedSeconds = seconds + minutes * 60;
  const percentage = (elapsedSeconds / totalSeconds) * 100;

  const timerMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const timerSeconds = seconds < 10 ? `0${seconds}` : seconds;

  const handleSettingsClick = () => {
    setShowSettings(true);
  };

  const handleCloseSettings = () => {
    setShowSettings(false);
  };

  const handleStartStopClick = () => {
    setIsPaused(!isPaused);
  };




  return (
    <div className="pomodoro text-center columns-sm">
      <div className="text-3xl pb-6">
        {displayMessage ? "Descanso" : "Trabajo"}
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
          className="btn btn-primary"
          onClick={handleStartStopClick}
        >
          {isPaused ? "Iniciar" : "Pausar"}
        </button>
        <button
          className="btn btn-primary"
          onClick={finalizarTiempo}
        >
          Finalizar
        </button>
        
      </div>
      
    </div>
  );
};

export default Pomodoro;