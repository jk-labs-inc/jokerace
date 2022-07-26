import { differenceInHours, intervalToDuration } from "date-fns";
import { isBefore } from "date-fns";

export function updateCountdown(countdownEndDatetime: Date) {
  const interval = intervalToDuration({
    start: (isBefore(new Date(), countdownEndDatetime) ? new Date() : countdownEndDatetime),
    end: countdownEndDatetime,
  });

  return {
    h: differenceInHours(countdownEndDatetime, new Date()),
    min: interval.minutes,
    sec: interval.seconds,
  };
}

export default updateCountdown;
