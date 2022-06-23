import { useState } from "react";
import { useInterval, useBoolean } from "react-use";
import { isWithinInterval, isBefore, isAfter } from "date-fns";
import updateCountdown from "@helpers/updateCountdown";

export function useCountdown(startDate: Date, endDate: Date) {
  const [countdown, setCountdown] = useState(updateCountdown(endDate));
  const [isCountdownRunning, setIsCountdownRunning] = useBoolean(
    isAfter(new Date(), startDate) && isBefore(new Date(), endDate),
  );

  useInterval(
    () => {
      setCountdown(updateCountdown(isBefore(new Date(), startDate) ? startDate : endDate));
      isWithinInterval(new Date(), {
        start: startDate,
        end: endDate,
      }) === false && setIsCountdownRunning(false);
    },
    isCountdownRunning ? 1000 : null,
  );

  return {
    countdown,
    isCountdownRunning,
    setIsCountdownRunning,
  };
}
