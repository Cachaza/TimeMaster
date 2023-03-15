import 'react-circular-progressbar/dist/styles.css';
import React, { useState, useEffect } from "react";

import { api } from "../utils/api";
import Router from 'next/router';


interface PomodoroProps {
  subjectId: string;
}

const Chronometer: React.FC<PomodoroProps> = ({ subjectId }) => {

  const [isPaused, setIsPaused] = useState(true);


  const time = api.asignaturas.añadirTiempo.useMutation();
  const getTiempos = api.asignaturas.getTiempos.useQuery({ subjectId: subjectId });
  const actualizarTiempoTotalBase = api.asignaturas.actualizarTiempoTotal.useMutation();
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  const [startTime, setStartTime] = useState<number | null>(null);



  async function addTime(tiempoE: number) {
    await time.mutateAsync({
      subjectId: subjectId,
      tiempo: tiempoE,
      totalTime: tiempoE,
    });
  }

  function getTimesAdded() {

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

  async function updateTotalTime(trabajado: number) {
    const antiguoTiempo = getTimesAdded();

    await actualizarTiempoTotalBase.mutateAsync({
      subjectId: subjectId,
      totalTime: antiguoTiempo + trabajado,
    });
       

  }

  useEffect(() => {
    if (!isPaused) {
      const intervalId = setInterval(() => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
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

  const handleFinish = () => {
    if (isPaused) {
      setIsPaused(!isPaused);
    }
    const timeInMinutes = Math.floor((timeElapsed / 1000) / 60);
    void updateTotalTime(timeInMinutes).then(r => console.log(r));
    void addTime(timeInMinutes);
    void Router.push('/user');
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
          onClick={handleFinish}
        >
          Finalizar
        </button>
        
      </div>
      
    </div>
  );
};

export default Chronometer;