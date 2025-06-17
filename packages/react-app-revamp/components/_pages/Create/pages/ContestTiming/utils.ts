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
  TwoDays = "2d",
  ThreeDays = "3d",
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
    value: TimingPeriod.TwoDays,
    label: "two days",
  },
  {
    value: TimingPeriod.ThreeDays,
    label: "three days",
  },
  {
    value: TimingPeriod.Custom,
    label: "custom",
  },
];

export const useTimingOptionForSubmissionPeriod = create<StoreState>(set => ({
  timingOption: timingPeriodsOptions[0], // one week
  setTimingOption: timingOption => set({ timingOption }),
}));

export const useTimingOptionForVotingPeriod = create<StoreState>(set => ({
  timingOption: timingPeriodsOptions[4], // three days
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
    case TimingPeriod.TwoDays:
      return moment(startDate).add(2, "days").toDate();
    case TimingPeriod.ThreeDays:
      return moment(startDate).add(3, "days").toDate();

    default:
      return startDate;
  }
};
