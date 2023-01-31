import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import React, { useState, useEffect } from "react";


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
          let minutes = displayMessage ? breakTime : workTime;
          let seconds = 59;

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
      <div className="text-3xl">
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
        <button
          className="btn btn-secondary"
          onClick={handleSettingsClick}
        >
          Configuración
        </button>
      </div>
      {showSettings && (
        <div className="settings">
          <div className="settings-header">
            <div className="settings-title">Configuración</div>
            <ReactSlider
              className="horizontal-slider"
              thumbClassName="example-thumb"
              trackClassName="example-track"
              renderThumb={(props, state) => (
                <div {...props}>{state.valueNow}</div>
              )}
              defaultValue={workTime}
              min={1}
              max={60}
              onChange={(value) => setMinutes(value)}
            />
          </div>
          <div className="settings-body">
            <div className="settings-label">Tiempo de trabajo</div>
            <div className="settings-value">{workTime}</div>
          </div>
          <div className="settings-body">
            <div className="settings-label">Tiempo de descanso</div>
            <div className="settings-value">{breakTime}</div>
          </div>
          <ReactSlider
            className="horizontal-slider"
            thumbClassName="example-thumb"
            trackClassName="example-track"
            renderThumb={(props, state) => (
              <div {...props}>{state.valueNow}</div>
            )}
            defaultValue={breakTime}
            min={1}
            max={60}
            onChange={(value) => setMinutes(value)}
          />
          <div className="settings-footer">
            <button

              className="btn btn-primary"
              onClick={handleCloseSettings}
            >
              Cerrar
            </button>

          </div>
                




            

               
        </div>
      )}
    </div>
  );
};

export default Pomodoro;