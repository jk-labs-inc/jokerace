import { toastLoading, toastSuccess } from "@components/UI/Toast";
import { chains, config } from "@config/wagmi";
import { getBlockDetails } from "@helpers/getBlock";
import getContestContractVersion from "@helpers/getContestContractVersion";
import { useError } from "@hooks/useError";
import { readContract, readContracts, simulateContract, waitForTransactionReceipt, writeContract } from "@wagmi/core";
import { addUserActionForAnalytics, saveUpdatedProposalsCommentStatusToAnalyticsV3 } from "lib/analytics/participants";
import { Abi } from "viem";
import { useAccount } from "wagmi";
import { Comment, CommentCore, useCommentsStore } from "./store";

export const COMMENTS_PER_PAGE = 12;

/**
 * @param address - contest address
 * @param chainId - contest chain ID
 * @param proposalId - proposal ID
 */
const useComments = (address: string, chainId: number, proposalId: string) => {
  const { address: accountAddress } = useAccount();
  const {
    setIsLoading,
    setIsSuccess,
    comments,
    setIsError,
    setComments,
    allCommentsIdsPerProposal,
    setAllCommentsIdsPerProposal,
    setCurrentPage,
    setTotalPages,
    setIsDeleting,
    setIsDeletingError,
    setIsDeletingSuccess,
    setIsAdding,
    setIsAddingError,
    setIsAddingSuccess,
    setIsPaginating,
    setIsPaginatingError,
    setIsPaginatingSuccess,
  } = useCommentsStore(state => state);
  const { handleError } = useError();
  const chainName = chains.filter(chain => chain.id === chainId)?.[0]?.name.toLowerCase() ?? "";

  async function getContractConfig() {
    try {
      const { abi } = await getContestContractVersion(address, chainId);

      if (abi === null) {
        const errorMessage = `RPC call failed`;
        handleError(errorMessage, "Error fetching contract config");
        setIsError(true);
        setIsSuccess(false);
        setIsLoading(false);
        return;
      }

      return {
        address: address as `0x${string}`,
        abi: abi as Abi,
        chainId: chainId,
      };
    } catch (error: any) {
      handleError(error.message, "Error fetching contract config");
      setIsError(true);
      setIsSuccess(false);
      setIsLoading(false);
    }
  }

  async function getCommentId(comment: CommentCore): Promise<string> {
    const contractConfig = await getContractConfig();

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
  }

  async function getComment(commentId: string): Promise<Comment> {
    const contractConfig = await getContractConfig();

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
  }

  async function getCommentsPerProposal(commentsIds: string[]) {
    try {
      const commentsPromises = commentsIds.map(id => getComment(id));
      const comments = await Promise.all(commentsPromises);

      setComments(comments);
    } catch (error: any) {
      handleError(error.message, "Error fetching comments for the proposal");
      setIsError(true);
    }
  }

  async function getCommentsPerPage(page: number) {
    setIsPaginating(true);
    setCurrentPage(page);
    const start = (page - 1) * COMMENTS_PER_PAGE;
    const end = start + COMMENTS_PER_PAGE;

    const pageCommentsIds = allCommentsIdsPerProposal.slice(start, end);

    try {
      const commentsPromises = pageCommentsIds.map(id => getComment(id));

      const newComments = await Promise.all(commentsPromises);

      const combinedComments = [...comments, ...newComments];
      setComments(combinedComments);
      setIsPaginating(false);
      setIsPaginatingSuccess(true);
    } catch (error: any) {
      handleError(error.message, `Error fetching comments for the page ${page}`);
      setIsPaginatingError(true);
      setIsPaginating(false);
      setIsPaginatingSuccess(false);
    }
  }

  async function getAllCommentsIdsPerProposal() {
    setIsLoading(true);
    setComments([]);
    setCurrentPage(1);
    const contractConfig = await getContractConfig();

    try {
      const contracts = [
        {
          ...contractConfig,
          functionName: "getProposalComments",
          args: [proposalId],
        },
        {
          ...contractConfig,
          functionName: "getAllDeletedCommentIds",
          args: [],
        },
      ];

      //@ts-ignore
      const [allCommentsIdsRaw, deletedCommentIdsRaw] = await readContracts(config, { contracts });

      const allCommentsIdsBigInt = allCommentsIdsRaw.result as bigint[];
      const deletedCommentIdsBigInt = deletedCommentIdsRaw.result as bigint[];

      const deletedCommentIdsSet = new Set(deletedCommentIdsBigInt.map(id => id.toString()));
      const allCommentsIds = allCommentsIdsBigInt.map(id => id.toString()).filter(id => !deletedCommentIdsSet.has(id));

      const commentsForPage = allCommentsIds.slice(0, COMMENTS_PER_PAGE);

      setAllCommentsIdsPerProposal(allCommentsIds);
      setTotalPages(Math.ceil(allCommentsIds.length / COMMENTS_PER_PAGE));
      await getCommentsPerProposal(commentsForPage);
      setIsLoading(false);
      setIsSuccess(true);
    } catch (error: any) {
      handleError(error.message, "Error fetching all comments ids per proposal");
      setIsError(true);
      setIsSuccess(false);
      setIsLoading(false);
    }
  }

  async function getCommentsWithSpecificFirst(commentId: string) {
    setIsLoading(true);
    setComments([]);
    setCurrentPage(1);
    const contractConfig = await getContractConfig();

    try {
      const contracts = [
        {
          ...contractConfig,
          functionName: "getProposalComments",
          args: [proposalId],
        },
        {
          ...contractConfig,
          functionName: "getAllDeletedCommentIds",
          args: [],
        },
      ];

      //@ts-ignore
      const [allCommentsIdsRaw, deletedCommentIdsRaw] = await readContracts(config, { contracts });

      const allCommentsIdsBigInt = allCommentsIdsRaw.result as bigint[];
      const deletedCommentIdsBigInt = deletedCommentIdsRaw.result as bigint[];

      const deletedCommentIdsSet = new Set(deletedCommentIdsBigInt.map(id => id.toString()));
      let allCommentsIds = allCommentsIdsBigInt.map(id => id.toString()).filter(id => !deletedCommentIdsSet.has(id));

      allCommentsIds = allCommentsIds.filter(id => id !== commentId);
      allCommentsIds.unshift(commentId);

      const commentsForPage = allCommentsIds.slice(0, COMMENTS_PER_PAGE);

      setAllCommentsIdsPerProposal(allCommentsIds);
      setTotalPages(Math.ceil(allCommentsIds.length / COMMENTS_PER_PAGE));
      await getCommentsPerProposal(commentsForPage);
      setIsLoading(false);
      setIsSuccess(true);
    } catch (error: any) {
      handleError(error.message, "Error fetching comments with specific first");
      setIsError(true);
      setIsSuccess(false);
      setIsLoading(false);
    }
  }

  async function addComment(content: string) {
    setIsAdding(true);
    setIsAddingSuccess(false);
    toastLoading("Adding comment...");
    try {
      const contractConfig = await getContractConfig();

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
        timestamp: blockInfo.timestamp,
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
      toastSuccess("Comment added successfully!");
      setIsAddingSuccess(true);
      setIsAdding(false);
    } catch (error: any) {
      handleError(error.message, "Error adding comment");
      setIsAddingError(error.message);
      setIsAdding(false);
    }
  }

  async function deleteComments(commentsIds: string[]) {
    setIsDeleting(true);
    setIsDeletingSuccess(false);
    toastLoading(`Deleting ${commentsIds.length} comment${commentsIds.length > 1 ? "s" : ""}...`);
    try {
      const contractConfig = await getContractConfig();

      if (!contractConfig) return;

      const { request } = await simulateContract(config, {
        ...contractConfig,
        functionName: "deleteComments",
        args: [commentsIds],
      });

      const hash = await writeContract(config, {
        ...request,
      });

      await waitForTransactionReceipt(config, { hash: hash });

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
      toastSuccess("Comment deleted successfully!");
      setIsDeletingSuccess(true);
      setIsDeleting(false);
    } catch (error: any) {
      handleError(error.message, "Error deleting comment");
      setIsDeletingError(error.message);
      setIsDeleting(false);
      setIsDeletingSuccess(false);
    }
  }

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
