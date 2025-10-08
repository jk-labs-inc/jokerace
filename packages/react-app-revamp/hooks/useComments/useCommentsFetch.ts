import { useError } from "@hooks/useError";
import { readContract, readContracts } from "@wagmi/core";
import { Comment, CommentCore } from "./store";
import { useCommentsContract } from "./useCommentsContract";

/**
 * Hook for fetching comment data from the blockchain
 * @param address - Contest contract address
 * @param chainId - Chain ID for the contest
 */
export const useCommentsFetch = (address: string, chainId: number) => {
  const { getContractConfig, config } = useCommentsContract(address, chainId);
  const { handleError } = useError();

  const getCommentId = async (comment: CommentCore): Promise<string> => {
    const contractConfig = getContractConfig();

    if (!contractConfig) return "";

    try {
      const commentId = (await readContract(config, {
        ...contractConfig,
        functionName: "hashComment",
        args: [comment],
      })) as bigint;

      return commentId.toString();
    } catch (error: any) {
      handleError(error.message, "Error fetching comment id");
      return "";
    }
  };

  const getComment = async (commentId: string): Promise<Comment> => {
    const contractConfig = getContractConfig();

    if (!contractConfig) {
      return {
        id: "",
        author: "",
        content: `Failed to load comment ${commentId}`,
        proposalId: "",
        createdAt: new Date(),
      };
    }

    try {
      const contracts = [
        {
          ...contractConfig,
          functionName: "getComment",
          args: [commentId],
        },
        {
          ...contractConfig,
          functionName: "commentIsDeleted",
          args: [commentId],
        },
      ];

      //@ts-ignore
      const [commentResult, isDeletedResult] = await readContracts(config, { contracts });

      const comment = commentResult.result as CommentCore;
      const isDeleted = isDeletedResult.result as boolean;
      const timestampInMilliseconds = Number(comment.timestamp) * 1000;

      return {
        id: commentId,
        author: comment.author,
        content: isDeleted
          ? "This comment has been deleted by the contest creator or the user who commented."
          : comment.commentContent,
        proposalId: comment.proposalId.toString(),
        createdAt: new Date(timestampInMilliseconds),
        isDeleted: isDeleted,
      };
    } catch (error) {
      return {
        id: "",
        author: "",
        content: `Failed to load comment ${commentId}`,
        proposalId: "",
        createdAt: new Date(),
      };
    }
  };

  const getCommentsPerProposal = async (commentsIds: string[]): Promise<Comment[]> => {
    try {
      const commentsPromises = commentsIds.map(id => getComment(id));
      const comments = await Promise.all(commentsPromises);
      return comments;
    } catch (error: any) {
      handleError(error.message, "Error fetching comments for the proposal");
      return [];
    }
  };

  return {
    getCommentId,
    getComment,
    getCommentsPerProposal,
  };
};
