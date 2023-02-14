import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import React, { useState, useEffect } from "react";
import { useSession } from 'next-auth/react'

import { api } from "../utils/api";
import Router from 'next/router';


interface PomodoroProps {
  workTime: number;
  breakTime: number;
  asignaturaId: string;
}

const Pomodoro: React.FC<PomodoroProps> = ({ workTime , breakTime, asignaturaId }) => {
  
  workTime = workTime * 60 * 1000;
  breakTime = breakTime * 60 * 1000;
  const tiempo = api.asignaturas.añadirTiempo.useMutation();
  const { data: sessionData } = useSession();
  const getTiempos = api.asignaturas.getTiempos.useQuery({ id: sessionData?.user.id, subjectId: asignaturaId });
  const actualizarTiempoTotalBase = api.asignaturas.actualizarTiempoTotal.useMutation();
  

  const [timeRemaining, setTimeRemaining] = useState<number>(workTime);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [isBreak, setIsBreak] = useState<boolean>(false);
  const [elapsedTime, setElapsedTime] = useState(0);


  


  async function addTime(tiempoE: number, tiempoT: number) {
    await tiempo.mutateAsync({
      subjectId: asignaturaId,
      id: sessionData?.user?.id,
      tiempo: tiempoE,
      totalTime: tiempoT + tiempoE,
    });
  }

  function getSumaTiempos() {

    if (getTiempos.data) {    
        let suma = 0;     
        for (let i = 0; i < getTiempos.data.length; i++) {
            suma += getTiempos.data[i]?.workedTime ?? 0;
        }
        return suma;

    } else {
        return 0;
    }

  }

  async function actualizarTiempoTotal(trabajado: number) {
    const antiguoTiempo = getSumaTiempos();

    await actualizarTiempoTotalBase.mutateAsync({
      subjectId: asignaturaId,
      id: sessionData?.user?.id,
      totalTime: antiguoTiempo + trabajado,
    });
       

  }

   function finalizarTiempo() {
    if(!isBreak){
      let tiempo
      
      const tiempoEstudiado = (workTime / (60* 1000)) - minutes;
      if(tiempoEstudiado <= 0){
        tiempo = 0;
      }else{
        tiempo = tiempoEstudiado - 1;
      }

      void actualizarTiempoTotal((tiempo));
      void addTime((tiempo), (breakTime / (60 * 1000)));
      
    }
    void Router.push('/user');
  }
 

  






  


  useEffect(() => {
    if (isRunning) {
      const intervalId = setInterval(() => {
        setTimeRemaining(prevTimeRemaining => {
          const timeElapsed = Date.now() - startTime! + elapsedTime;
          const targetTime = isBreak ? breakTime : workTime;
          const newTimeRemaining = targetTime - timeElapsed;
          if (newTimeRemaining <= 0) {
            if(!isBreak){
              void actualizarTiempoTotal((workTime / (60* 1000)));
              void addTime((workTime / (60* 1000)), (breakTime / (60 * 1000)));
              console.log("tiempo añadido");
            }
            const audio = new Audio('https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3');
            void audio.play();
            setIsBreak(!isBreak);
            setTimeRemaining(isBreak ? breakTime : workTime);
            setElapsedTime(0);
            setStartTime(Date.now());
            return isBreak ? breakTime : workTime;
          }
          return newTimeRemaining;
        });
      }, 100);
      return () => clearInterval(intervalId);
    }
  }, [isRunning, startTime, elapsedTime, isBreak]);


  const handleStart = () => {
    setIsRunning(true);
    if (!startTime) {
      setStartTime(Date.now());
    } else {
      setElapsedTime(Date.now() - startTime + elapsedTime);
      setStartTime(Date.now());
    }
  };
  
  const handleStop = () => {
    setIsRunning(false);
    setElapsedTime(elapsedTime + (Date.now() - startTime!));
    setStartTime(null);
  };

  const seconds = Math.floor(timeRemaining / 1000) % 60;
  const minutes = Math.floor(timeRemaining / (1000 * 60)) % 60;
  const percentage = (timeRemaining / (isBreak ? breakTime : workTime)) * 100;

  const timerMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const timerSeconds = seconds < 10 ? `0${seconds}` : seconds;

 



  return (
    <div>
      <p>
        <h1>{isBreak ? 'Break' : 'Work'}</h1>
        <CircularProgressbarWithChildren
          value={percentage}
          styles={buildStyles({
            pathColor: isBreak ? '#f00' : '#0f0',
            trailColor: '#000',
          })}
          text={`${String(timerMinutes)}:${String(timerSeconds)}`}
        />
        
      </p>
      <div className="buttons pt-5 text-center">
        <button onClick={isRunning ? handleStop : handleStart} className='btn btn-primary pr-2 font-bold text-center'>
          {isRunning ? 'Stop' : 'Start'}
        </button>
        <button onClick={finalizarTiempo} className='btn btn-primary pl-2 font-bold text-center'>Finalizar</button>
      </div>
    </div>
  );
};

export default Pomodoro;