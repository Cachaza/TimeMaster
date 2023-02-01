import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import React, { useState, useEffect, useRef } from "react";
import useSound from 'use-sound';


import ReactSlider from 'react-slider';

interface PomodoroProps {
  workTime: number;
  breakTime: number;
}

const Pomodoro: React.FC<PomodoroProps> = ({ workTime, breakTime }) => {
  const [minutes, setMinutes] = useState(workTime);
  const [seconds, setSeconds] = useState(0);
  const [displayMessage, setDisplayMessage] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [showSettings, setShowSettings] = useState(false);







  let cancionDescanso = new Audio('https://rr1---sn-8vq54voxn25po-h5qel.googlevideo.com/videoplayback?expire=1675268458&ei=Cj3aY8-5M8eU_tcP0c6PqA8&ip=34.135.20.23&id=o-AEm5_kNH4GEeae8G2m-SjGXLmdVljYFEINGgAL69wJ20&itag=251&source=youtube&requiressl=yes&vprv=1&mime=audio%2Fwebm&ns=vJW4uJ28kWjoSeRUsJUfvaEL&gir=yes&clen=538912321&dur=36082.941&lmt=1651972966781508&keepalive=yes&fexp=24007246&c=WEB&txp=4532434&n=0sPumyVarDcCatC9VvKZHw&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cvprv%2Cmime%2Cns%2Cgir%2Cclen%2Cdur%2Clmt&sig=AOq0QJ8wRAIgJbM-buR_R6SyxLZuKRn-cwPAZAJ6kyJ4rsAs5mfdo3ACICtGEzk3587nlQLtEYVba371TfF_UxEIgQHP-xJ5bXEu&ratebypass=yes&redirect_counter=1&rm=sn-qxosr7e&req_id=61bc05829bcca3ee&cms_redirect=yes&ipbypass=yes&mh=Kq&mip=95.61.11.147&mm=31&mn=sn-8vq54voxn25po-h5qel&ms=au&mt=1675246402&mv=m&mvi=1&pl=24&lsparams=ipbypass,mh,mip,mm,mn,ms,mv,mvi,pl&lsig=AG3C_xAwRQIhAMgXJDdIB8gYDPWJ7nHo9dWUx38f7tNmF8a79YCT-ttaAiBsa9m436HYnVvOc5_zMM_L4mVpJnQGY3X-hy9M3DQE1g%3D%3D')

  


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
      <div className="buttons">
        <button
          className="btn btn-primary"
          onClick={handleStartStopClick}
        >
          {isPaused ? "Iniciar" : "Pausar"}
        </button>
        
      </div>
      
    </div>
  );
};

export default Pomodoro;