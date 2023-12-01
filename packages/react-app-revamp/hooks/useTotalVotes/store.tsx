import { create } from "zustand";

type TotalVotesState = {
  totalVotes: number;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  setTotalVotes: (totalVotes: number) => void;
  setIsLoading: (isLoading: boolean) => void;
  setIsSuccess: (isSuccess: boolean) => void;
  setIsError: (isError: boolean) => void;
};

export const useTotalVotesOnContestStore = create<TotalVotesState>(set => ({
  totalVotes: 0,
  isLoading: false,
  isSuccess: false,
  isError: false,
  setTotalVotes: totalVotes => set({ totalVotes }),
  setIsLoading: isLoading => set({ isLoading }),
  setIsSuccess: isSuccess => set({ isSuccess }),
  setIsError: isError => set({ isError }),
}));
