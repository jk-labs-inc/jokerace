import moment from "moment";
import { Period } from "../contestTimingSlice";

export interface TimingDetails {
  month: number;
  day: number;
  hour: number;
  period: Period;
}

export const createDateFromTiming = (timing: TimingDetails): Date => {
  const now = moment();

  let hour24 = timing.hour;
  if (timing.period === Period.PM && timing.hour !== 12) {
    hour24 = timing.hour + 12;
  } else if (timing.period === Period.AM && timing.hour === 12) {
    hour24 = 0;
  }

  const date = moment()
    .year(now.year())
    .month(timing.month)
    .date(timing.day)
    .hour(hour24)
    .minute(0)
    .second(0)
    .millisecond(0);

  return date.toDate();
};

export const convertDateToTimingDetails = (date: Date): TimingDetails => {
  const dateMoment = moment(date);
  return {
    month: dateMoment.month(),
    day: dateMoment.date(),
    hour: dateMoment.hour() === 0 ? 12 : dateMoment.hour() > 12 ? dateMoment.hour() - 12 : dateMoment.hour(),
    period: dateMoment.hour() >= 12 ? Period.PM : Period.AM,
  };
};
