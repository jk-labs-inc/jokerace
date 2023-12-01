import { create } from "zustand";

type TotalVotesCastState = {
  totalVotesCast: number;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  setTotalVotesCast: (totalVotesCast: number) => void;
  setIsLoading: (isLoading: boolean) => void;
  setIsSuccess: (isSuccess: boolean) => void;
  setIsError: (isError: boolean) => void;
};

export const useTotalVotesCastStore = create<TotalVotesCastState>(set => ({
  totalVotesCast: 0,
  isLoading: false,
  isSuccess: false,
  isError: false,
  setTotalVotesCast: totalVotesCast => set({ totalVotesCast }),
  setIsLoading: isLoading => set({ isLoading }),
  setIsSuccess: isSuccess => set({ isSuccess }),
  setIsError: isError => set({ isError }),
}));
