import React, { useState, useEffect } from 'react';

const PomodoroTimer: React.FC = () => {
  const workTime = 1 * 60  * 1000;
  const breakTime = 5 * 60 * 1000;

  const [timeRemaining, setTimeRemaining] = useState<number>(workTime);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [isBreak, setIsBreak] = useState<boolean>(false);
  const [elapsedTime, setElapsedTime] = useState(0);


  useEffect(() => {
    if (isRunning) {
      const intervalId = setInterval(() => {
        setTimeRemaining(prevTimeRemaining => {
          const timeElapsed = Date.now() - startTime! + elapsedTime;
          const targetTime = isBreak ? breakTime : workTime;
          const newTimeRemaining = targetTime - timeElapsed;
          if (newTimeRemaining <= 0) {
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

  return (
    <div>
      <p>
        {minutes.toString().padStart(2, '0')}:
        {seconds.toString().padStart(2, '0')}
      </p>
      <p>{isBreak ? 'Break' : 'Work'}</p>
      <button onClick={handleStart} disabled={isRunning}>
        Start
      </button>
      <button onClick={handleStop} disabled={!isRunning}>
        Stop
      </button>
    </div>
  );
};

export default PomodoroTimer;
