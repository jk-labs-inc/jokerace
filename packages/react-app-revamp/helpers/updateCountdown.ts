import { differenceInDays, intervalToDuration } from "date-fns";

export function updateCountdown(countdownEndDatetime: Date) {
  const interval = intervalToDuration({
    start: new Date(),
    end: countdownEndDatetime,
  });

  return {
    days: differenceInDays(countdownEndDatetime, new Date()),
    hr: interval.hours,
    min: interval.minutes,
    sec: interval.seconds,
  };
}

export default updateCountdown;
