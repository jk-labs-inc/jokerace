import { create } from "zustand";
import { Option } from "../../components/DefaultDropdown";
import moment from "moment";

interface StoreState {
  timingOption: Option;
  setTimingOption: (option: Option) => void;
}

export enum TimingPeriod {
  OneWeek = "1w",
  OneHour = "1hr",
  OneDay = "1d",
  OneMonth = "1m",
  Custom = "custom",
}

export const timingPeriodsOptions = [
  {
    value: TimingPeriod.OneWeek,
    label: "one week",
  },
  {
    value: TimingPeriod.OneHour,
    label: "one hour",
  },
  {
    value: TimingPeriod.OneDay,
    label: "one day",
  },
  {
    value: TimingPeriod.OneMonth,
    label: "one month",
  },
  {
    value: TimingPeriod.Custom,
    label: "custom",
  },
];

export const useTimingOptionForSubmissionPeriod = create<StoreState>(set => ({
  timingOption: timingPeriodsOptions[0],
  setTimingOption: timingOption => set({ timingOption }),
}));

export const useTimingOptionForVotingPeriod = create<StoreState>(set => ({
  timingOption: timingPeriodsOptions[0],
  setTimingOption: timingOption => set({ timingOption }),
}));

export const addTimeBasedOnPeriod = (startDate: Date, period: TimingPeriod): Date => {
  switch (period) {
    case TimingPeriod.OneWeek:
      return moment(startDate).add(1, "weeks").toDate();
    case TimingPeriod.OneHour:
      return moment(startDate).add(1, "hours").toDate();
    case TimingPeriod.OneDay:
      return moment(startDate).add(1, "days").toDate();
    case TimingPeriod.OneMonth:
      return moment(startDate).add(1, "months").toDate();
    default:
      return startDate;
  }
};
