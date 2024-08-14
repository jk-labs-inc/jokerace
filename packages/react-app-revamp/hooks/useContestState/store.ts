import { create } from "zustand";

export enum ContestStateEnum {
  NotStarted,
  Active,
  Canceled,
  Queued,
  Completed,
}

type Store = {
  contestState: ContestStateEnum;
  setContestState: (state: ContestStateEnum) => void;
};

export const useContestStateStore = create<Store>(set => ({
  contestState: ContestStateEnum.NotStarted,
  setContestState: (state: ContestStateEnum) => set({ contestState: state }),
}));
