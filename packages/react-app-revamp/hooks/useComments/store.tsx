import { create } from "zustand";

/**
 * Only used when calling contract methods, not for frontend state
 */
export interface CommentCore {
  author: string;
  timestamp: number;
  proposalId: string;
  commentContent: string;
}

export interface Comment {
  id: string;
  author: string;
  createdAt: Date;
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
  isDeleting: boolean;
  isDeletingSuccess: boolean;
  isDeletingError: string;
  setAllCommentsIdsPerProposal: (allCommentsIdsPerProposal: string[]) => void;
  setComments: (comments: Comment[]) => void;
  setIsLoading: (isLoading: boolean) => void;
  setIsPaginating: (isPaginating: boolean) => void;
  setIsSuccess: (isSuccess: boolean) => void;
  setError: (error: string) => void;
  setIsDeleting: (isDeleting: boolean) => void;
  setIsDeletingSuccess: (isDeletingSuccess: boolean) => void;
  setIsDeletingError: (isDeletingError: string) => void;
  setCurrentPage: (currentPage: number) => void;
  setTotalPages: (totalPages: number) => void;
}

export const useCommentsStore = create<CommentsState>(set => ({
  allCommentsIdsPerProposal: [],
  comments: [],
  isLoading: false,
  isPaginating: false,
  isSuccess: false,
  error: "",
  currentPage: 1,
  totalPages: 1,
  isDeleting: false,
  isDeletingSuccess: false,
  isDeletingError: "",
  setAllCommentsIdsPerProposal: allCommentsIdsPerProposal => set({ allCommentsIdsPerProposal }),
  setComments: comments => set({ comments }),
  setIsLoading: isLoading => set({ isLoading }),
  setIsPaginating: isPaginating => set({ isPaginating }),
  setIsSuccess: isSuccess => set({ isSuccess }),
  setError: error => set({ error }),
  setIsDeleting: isDeleting => set({ isDeleting }),
  setIsDeletingSuccess: isDeletingSuccess => set({ isDeletingSuccess }),
  setIsDeletingError: isDeletingError => set({ isDeletingError }),
  setCurrentPage: currentPage => set({ currentPage }),
  setTotalPages: totalPages => set({ totalPages }),
}));
