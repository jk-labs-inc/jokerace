import { differenceInHours, intervalToDuration } from "date-fns";

export function updateCountdown(countdownEndDatetime: Date) {
  const interval = intervalToDuration({
    start: new Date(),
    end: countdownEndDatetime,
  });

  return {
    h: differenceInHours(countdownEndDatetime, new Date()),
    min: interval.minutes,
    sec: interval.seconds,
  };
}

export default updateCountdown;
