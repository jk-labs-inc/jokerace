import { toastLoading, toastSuccess } from "@components/UI/Toast";
import { getBlockDetails } from "@helpers/getBlock";
import { useError } from "@hooks/useError";
import { simulateContract, waitForTransactionReceipt, writeContract } from "@wagmi/core";
import { addUserActionForAnalytics, saveUpdatedProposalsCommentStatusToAnalyticsV3 } from "lib/analytics/participants";
import { useAccount } from "wagmi";
import { useCommentsContract } from "./useCommentsContract";
import { useCommentsFetch } from "./useCommentsFetch";
import { useCommentsStore } from "./store";

/**
 * Hook for handling comment actions (add, delete)
 * @param address - Contest contract address
 * @param chainId - Chain ID for the contest
 * @param proposalId - Proposal ID for the comment
 */
export const useCommentsActions = (address: string, chainId: number, proposalId: string) => {
  const { address: accountAddress } = useAccount();
  const { getContractConfig, chainName, config } = useCommentsContract(address, chainId);
  const { getCommentId, getComment } = useCommentsFetch(address, chainId);
  const { handleError } = useError();

  const {
    comments,
    setComments,
    setIsAdding,
    setIsAddingError,
    setIsAddingSuccess,
    setIsDeleting,
    setIsDeletingError,
    setIsDeletingSuccess,
  } = useCommentsStore(state => state);

  const addComment = async (content: string) => {
    setIsAdding(true);
    setIsAddingSuccess(false);
    toastLoading({
      message: "Adding comment...",
    });

    try {
      const contractConfig = getContractConfig();

      if (!contractConfig) return;

      await simulateContract(config, {
        ...contractConfig,
        functionName: "comment",
        args: [proposalId, content],
      });

      const hash = await writeContract(config, {
        ...contractConfig,
        functionName: "comment",
        args: [proposalId, content],
      });

      const txReceipt = await waitForTransactionReceipt(config, { hash: hash });
      const blockInfo = await getBlockDetails(txReceipt.blockHash, chainId);

      if (!blockInfo) throw new Error("Error fetching block details");

      const commentId = await getCommentId({
        author: accountAddress ?? "",
        commentContent: content,
        proposalId: proposalId,
        timestamp: Number(blockInfo.timestamp),
      });

      try {
        await addUserActionForAnalytics({
          contest_address: address,
          user_address: accountAddress,
          network_name: chainName,
          proposal_id: proposalId,
          created_at: Math.floor(Date.now() / 1000),
          comment_id: commentId,
        });
      } catch (error) {
        console.error("error in addUserActionForAnalytics on comment", error);
      }

      const newComment = await getComment(commentId);
      const combinedComments = [...comments, newComment];

      setComments(combinedComments);
      toastSuccess({
        message: "Comment added successfully!",
      });
      setIsAddingSuccess(true);
      setIsAdding(false);
    } catch (error: any) {
      handleError(error.message, "Error adding comment");
      setIsAddingError(error.message);
      setIsAdding(false);
    }
  };

  const deleteComments = async (commentsIds: string[]) => {
    setIsDeleting(true);
    setIsDeletingSuccess(false);
    toastLoading({
      message: `Deleting ${commentsIds.length} comment${commentsIds.length > 1 ? "s" : ""}...`,
    });

    try {
      const contractConfig = getContractConfig();

      if (!contractConfig) return;

      const { request } = await simulateContract(config, {
        ...contractConfig,
        functionName: "deleteComments",
        args: [commentsIds],
      });

      const hash = await writeContract(config, {
        ...request,
      });

      await waitForTransactionReceipt(config, { hash: hash, confirmations: 2 });

      try {
        if (!accountAddress) return;

        await saveUpdatedProposalsCommentStatusToAnalyticsV3(
          accountAddress,
          address,
          chainName,
          proposalId,
          commentsIds,
        );
      } catch (error: any) {
        console.error("Error in saveUpdatedProposalsCommentStatusToAnalyticsV3:", error.message);
      }

      const newComments = comments.filter(comment => !commentsIds.includes(comment.id));

      setComments(newComments);
      toastSuccess({
        message: "Comment deleted successfully!",
      });
      setIsDeletingSuccess(true);
      setIsDeleting(false);
    } catch (error: any) {
      handleError(error.message, "Error deleting comment");
      setIsDeletingError(error.message);
      setIsDeleting(false);
      setIsDeletingSuccess(false);
    }
  };

  return {
    addComment,
    deleteComments,
  };
};
