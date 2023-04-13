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
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      setCountdown({ h: hours, min: minutes, sec: seconds });
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
