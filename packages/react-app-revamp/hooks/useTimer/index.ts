import { useEffect, useRef, useState } from "react";

interface TimerConfig {
  interval?: number;
  targetDate?: Date;
}

/**
 * Custom hook that implements a synchronized timer following Dan Abramov's pattern.
 * Supports both cyclical timers and countdown to specific dates.
 * https://overreacted.io/making-setinterval-declarative-with-react-hooks/
 */
export const useTimer = (config: TimerConfig): number => {
  const { interval, targetDate } = config;

  const [timeLeft, setTimeLeft] = useState(() => {
    if (interval && interval > 0) {
      const now = Math.floor(Date.now() / 1000);
      const cyclePosition = now % interval;
      return interval - cyclePosition;
    } else if (targetDate) {
      const now = Date.now();
      const target = targetDate.getTime();
      return Math.max(0, Math.floor((target - now) / 1000));
    }
    return 0;
  });

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const clearPreviousTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  useEffect(() => {
    if (!interval && !targetDate) return;

    const updateTimer = () => {
      if (interval && interval > 0) {
        const now = Math.floor(Date.now() / 1000);
        const cyclePosition = now % interval;
        const newTimeLeft = interval - cyclePosition;
        setTimeLeft(newTimeLeft === 0 ? interval : newTimeLeft);
      } else if (targetDate) {
        const now = Date.now();
        const target = targetDate.getTime();
        const newTimeLeft = Math.max(0, Math.floor((target - now) / 1000));
        setTimeLeft(newTimeLeft);

        if (newTimeLeft <= 0) {
          return;
        }
      }

      timeoutRef.current = setTimeout(updateTimer, 1000);
    };

    updateTimer();

    return clearPreviousTimeout;
  }, [interval, targetDate]);

  return timeLeft;
};

export const usePriceCurveTimer = (interval: number): number => {
  return useTimer({ interval });
};

export const useCountdownTimer = (targetDate: Date): number => {
  return useTimer({ targetDate });
};
