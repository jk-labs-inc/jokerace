/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";

type Countdown = {
  h: number;
  min: number;
  sec: number;
};

const useCountdown = (startDate: Date, endDate: Date): { countdown: Countdown; isCountdownRunning: boolean } => {
  const [countdown, setCountdown] = useState<Countdown>({ h: 0, min: 0, sec: 0 });
  const [isCountdownRunning, setIsCountdownRunning] = useState(false);

  const calculateCountdown = (): Countdown => {
    const now = new Date();
    const distance = endDate.getTime() - now.getTime();

    if (distance <= 0) {
      return { h: 0, min: 0, sec: 0 };
    } else {
      const totalSeconds = Math.floor(distance / 1000);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      return { h: hours, min: minutes, sec: seconds };
    }
  };

  useEffect(() => {
    const updateCountdown = () => {
      const newCountdown = calculateCountdown();
      if (newCountdown.h !== countdown.h || newCountdown.min !== countdown.min || newCountdown.sec !== countdown.sec) {
        setCountdown(newCountdown);
        setIsCountdownRunning(newCountdown.h !== 0 || newCountdown.min !== 0 || newCountdown.sec !== 0);
      }
    };

    updateCountdown();

    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [countdown, endDate]);

  return { countdown, isCountdownRunning };
};

export default useCountdown;
