import { create } from "zustand";

export interface Comment {
  author: string;
  timestamp: number;
  content: string;
  proposalId: string;
}

interface CommentsState {
  allCommentsIdsPerProposal: string[];
  comments: Comment[];
  isLoading: boolean;
  isPaginating: boolean;
  isSuccess: boolean;
  error: string;
  currentPage: number;
  totalPages: number;
  setAllCommentsIdsPerProposal: (allCommentsIdsPerProposal: string[]) => void;
  setComments: (comments: Comment[]) => void;
  setIsLoading: (isLoading: boolean) => void;
  setIsPaginating: (isPaginating: boolean) => void;
  setIsSuccess: (isSuccess: boolean) => void;
  setError: (error: string) => void;
  setCurrentPage: (currentPage: number) => void;
  setTotalPages: (totalPages: number) => void;
}

export const useCommentsStore = create<CommentsState>((set, get) => ({
  allCommentsIdsPerProposal: [],
  comments: [],
  isLoading: false,
  isSuccess: false,
  error: "",
  isPaginating: false,
  currentPage: 1,
  totalPages: 0,
  setIsPaginating: (isPaginating: boolean) => {
    set({ isPaginating });
  },
  setCurrentPage: (currentPage: number) => {
    set({ currentPage });
  },
  setTotalPages: (totalPages: number) => {
    set({ totalPages });
  },
  setAllCommentsIdsPerProposal: (allCommentsIdsPerProposal: string[]) => {
    set({ allCommentsIdsPerProposal });
  },
  setComments: (comments: Comment[]) => {
    set({ comments });
  },
  setIsLoading: (isLoading: boolean) => {
    set({ isLoading });
  },
  setIsSuccess: (isSuccess: boolean) => {
    set({ isSuccess });
  },
  setError: (error: string) => {
    set({ error });
  },
}));
