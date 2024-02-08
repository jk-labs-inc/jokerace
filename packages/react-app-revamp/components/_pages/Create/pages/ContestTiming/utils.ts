import { create } from "zustand";
import { Option } from "../../components/DefaultDropdown";

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
