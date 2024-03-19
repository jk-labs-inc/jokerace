import { create } from "zustand";

type TotalVotesState = {
  totalVotes: number;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  isAnyoneCanVote: boolean;
  setTotalVotes: (totalVotes: number) => void;
  setIsLoading: (isLoading: boolean) => void;
  setIsSuccess: (isSuccess: boolean) => void;
  setIsError: (isError: boolean) => void;
  setIsAnyoneCanVote: (isAnyoneCanVote: boolean) => void;
};

export const useTotalVotesOnContestStore = create<TotalVotesState>(set => ({
  totalVotes: 0,
  isLoading: false,
  isSuccess: false,
  isError: false,
  isAnyoneCanVote: false,
  setTotalVotes: totalVotes => set({ totalVotes }),
  setIsLoading: isLoading => set({ isLoading }),
  setIsSuccess: isSuccess => set({ isSuccess }),
  setIsError: isError => set({ isError }),
  setIsAnyoneCanVote: isAnyoneCanVote => set({ isAnyoneCanVote }),
}));
