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
  isPaginatingSuccess: boolean;
  isPaginatingError: boolean;
  isSuccess: boolean;
  isError: boolean;
  currentPage: number;
  totalPages: number;
  isDeleting: boolean;
  isDeletingSuccess: boolean;
  isDeletingError: string;
  isAdding: boolean;
  isAddingSuccess: boolean;
  isAddingError: string;
  setAllCommentsIdsPerProposal: (allCommentsIdsPerProposal: string[]) => void;
  setComments: (comments: Comment[]) => void;
  setIsLoading: (isLoading: boolean) => void;
  setIsPaginating: (isPaginating: boolean) => void;
  setIsPaginatingSuccess: (isPaginatingSuccess: boolean) => void;
  setIsPaginatingError: (isPaginatingError: boolean) => void;
  setIsSuccess: (isSuccess: boolean) => void;
  setIsError: (error: boolean) => void;
  setIsDeleting: (isDeleting: boolean) => void;
  setIsDeletingSuccess: (isDeletingSuccess: boolean) => void;
  setIsDeletingError: (isDeletingError: string) => void;
  setIsAdding: (isAdding: boolean) => void;
  setIsAddingSuccess: (isAddingSuccess: boolean) => void;
  setIsAddingError: (isAddingError: string) => void;
  setCurrentPage: (currentPage: number) => void;
  setTotalPages: (totalPages: number) => void;
}

export const useCommentsStore = create<CommentsState>(set => ({
  allCommentsIdsPerProposal: [],
  comments: [],
  isLoading: false,
  isPaginating: false,
  isPaginatingSuccess: false,
  isPaginatingError: false,
  isSuccess: false,
  isError: false,
  currentPage: 1,
  totalPages: 1,
  isDeleting: false,
  isDeletingSuccess: false,
  isDeletingError: "",
  isAdding: false,
  isAddingSuccess: false,
  isAddingError: "",
  setAllCommentsIdsPerProposal: allCommentsIdsPerProposal => set({ allCommentsIdsPerProposal }),
  setComments: comments => set({ comments }),
  setIsLoading: isLoading => set({ isLoading }),
  setIsPaginating: isPaginating => set({ isPaginating }),
  setIsPaginatingSuccess: isPaginatingSuccess => set({ isPaginatingSuccess }),
  setIsPaginatingError: isPaginatingError => set({ isPaginatingError }),
  setIsSuccess: isSuccess => set({ isSuccess }),
  setIsError: isError => set({ isError }),
  setIsDeleting: isDeleting => set({ isDeleting }),
  setIsDeletingSuccess: isDeletingSuccess => set({ isDeletingSuccess }),
  setIsDeletingError: isDeletingError => set({ isDeletingError }),
  setIsAdding: isAdding => set({ isAdding }),
  setIsAddingSuccess: isAddingSuccess => set({ isAddingSuccess }),
  setIsAddingError: isAddingError => set({ isAddingError }),
  setCurrentPage: currentPage => set({ currentPage }),
  setTotalPages: totalPages => set({ totalPages }),
}));
