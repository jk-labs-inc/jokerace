import { useCommentsActions } from "./useCommentsActions";
import { useCommentsPagination } from "./useCommentsPagination";
import { useCommentsFetch } from "./useCommentsFetch";

export { COMMENTS_PER_PAGE } from "./useCommentsPagination";

/**
 * Main orchestrator hook for comments functionality
 * Composes smaller focused hooks for better maintainability
 * @param address - contest address
 * @param chainId - contest chain ID
 * @param proposalId - proposal ID
 */
const useComments = (address: string, chainId: number, proposalId: string) => {
  const { getAllCommentsIdsPerProposal, getCommentsWithSpecificFirst, getCommentsPerPage } = useCommentsPagination(
    address,
    chainId,
    proposalId,
  );
  const { addComment, deleteComments } = useCommentsActions(address, chainId, proposalId);
  const { getCommentId } = useCommentsFetch(address, chainId);

  return {
    addComment,
    getAllCommentsIdsPerProposal,
    getCommentsWithSpecificFirst,
    getCommentsPerPage,
    getCommentId,
    deleteComments,
  };
};

export default useComments;
