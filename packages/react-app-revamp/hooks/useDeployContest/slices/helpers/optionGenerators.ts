import moment from "moment";
import { TimingOption } from "../contestTimingSlice";
import { TimingDetails, createDateFromTiming } from "./dateHelpers";

export const generateVotingOpenMonthOptions = (): TimingOption[] => {
  const now = moment();
  const oneMonthFromNow = moment().add(1, "month");
  const months: TimingOption[] = [];
  const monthsSet = new Set<number>();

  let current = now.clone().startOf("day");
  while (current.isSameOrBefore(oneMonthFromNow)) {
    const monthNum = current.month();
    if (!monthsSet.has(monthNum)) {
      monthsSet.add(monthNum);
      months.push({
        label: current.format("MMMM"),
        value: monthNum.toString(),
      });
    }
    current.add(1, "day");
  }

  return months;
};

export const generateVotingOpenDayOptions = (votingOpenMonth: number): TimingOption[] => {
  const now = moment();
  const oneMonthFromNow = moment().add(1, "month");
  const days: TimingOption[] = [];

  let current = now.clone().startOf("day");
  while (current.isSameOrBefore(oneMonthFromNow)) {
    if (current.month() === votingOpenMonth) {
      days.push({
        label: current.format("D"),
        value: current.date().toString(),
      });
    }
    current.add(1, "day");
  }

  return days;
};

export const generateHourOptions = (): TimingOption[] => {
  const hours: TimingOption[] = [];
  for (let i = 1; i <= 12; i++) {
    hours.push({
      label: `${i}:00`,
      value: i.toString(),
    });
  }
  return hours;
};

export const generateVotingCloseMonthOptions = (votingOpen: TimingDetails): TimingOption[] => {
  const votingOpenDate = moment(createDateFromTiming(votingOpen));
  const oneDayAfter = votingOpenDate.clone().add(1, "day");
  const months: TimingOption[] = [];
  const monthsSet = new Set<number>();

  let current = votingOpenDate.clone();
  while (current.isSameOrBefore(oneDayAfter)) {
    const monthNum = current.month();
    if (!monthsSet.has(monthNum)) {
      monthsSet.add(monthNum);
      months.push({
        label: current.format("MMMM"),
        value: monthNum.toString(),
      });
    }
    current.add(1, "day");
  }

  return months;
};

export const generateVotingCloseDayOptions = (votingOpen: TimingDetails, votingCloseMonth: number): TimingOption[] => {
  const votingOpenDate = moment(createDateFromTiming(votingOpen));
  const oneDayAfter = votingOpenDate.clone().add(1, "day");
  const days: TimingOption[] = [];

  let current = votingOpenDate.clone();
  while (current.isSameOrBefore(oneDayAfter)) {
    if (current.month() === votingCloseMonth) {
      const dayNum = current.date();
      if (!days.find(d => d.value === dayNum.toString())) {
        days.push({
          label: current.format("D"),
          value: dayNum.toString(),
        });
      }
    }
    current.add(1, "hour");
  }

  return days;
};
