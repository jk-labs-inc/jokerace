import { useState, useEffect } from "react";

const useCountdown = (startDate: Date, endDate: Date) => {
  const [countdown, setCountdown] = useState({ h: 0, min: 0, sec: 0 });
  const [isCountdownRunning, setIsCountdownRunning] = useState(false);

  const calculateCountdown = () => {
    const now = new Date();
    const distance = endDate.getTime() - now.getTime();

    if (distance <= 0) {
      setIsCountdownRunning(false);
      setCountdown({ h: 0, min: 0, sec: 0 });
    } else {
      setIsCountdownRunning(true);
      const totalSeconds = Math.floor(distance / 1000);
      const totalMinutes = Math.floor(totalSeconds / 60);
      const minutes = totalMinutes % 60;
      const seconds = totalSeconds % 60;
      const totalRemainingHours = Math.floor(distance / (1000 * 60 * 60));
      setCountdown({ h: totalRemainingHours, min: minutes, sec: seconds });
    }
  };

  useEffect(() => {
    const now = new Date();
    if (now >= startDate && now < endDate) {
      setIsCountdownRunning(true);
      calculateCountdown();
    } else {
      setIsCountdownRunning(false);
    }

    const interval = setInterval(() => {
      calculateCountdown();
    }, 1000);

    return () => clearInterval(interval);
  }, [startDate, endDate]);

  return { countdown, isCountdownRunning };
};

export default useCountdown;
