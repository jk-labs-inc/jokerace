import { toastLoading, toastSuccess } from "@components/UI/Toast";
import { getBlockDetails } from "@helpers/getBlock";
import getContestContractVersion from "@helpers/getContestContractVersion";
import { useError } from "@hooks/useError";
import { prepareWriteContract, readContract, readContracts, waitForTransaction, writeContract } from "@wagmi/core";
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
    setError,
    setComments,
    allCommentsIdsPerProposal,
    setAllCommentsIdsPerProposal,
    setCurrentPage,
    setTotalPages,
    setIsDeleting,
    setIsDeletingError,
    setIsDeletingSuccess,
  } = useCommentsStore(state => state);
  const { handleError } = useError();

  async function getContractConfig() {
    try {
      const { abi } = await getContestContractVersion(address, chainId);

      if (abi === null) {
        const errorMessage = `RPC call failed`;
        setError(errorMessage);
        setIsSuccess(false);
        setIsLoading(false);
        return;
      }

      return {
        address: address as `0x${string}`,
        abi: abi as unknown as Abi,
        chainId: chainId,
      };
    } catch (e) {
      setError("something went wrong while getting contract config");
      setIsSuccess(false);
      setIsLoading(false);
    }
  }

  async function getCommentId(comment: CommentCore): Promise<string> {
    const contractConfig = await getContractConfig();

    try {
      //@ts-ignore
      const commentId = (await readContract({
        ...contractConfig,
        functionName: "hashComment",
        args: [comment],
      })) as bigint;

      return commentId.toString();
    } catch (error) {
      return "";
    }
  }

  async function getComment(commentId: string): Promise<Comment> {
    const contractConfig = await getContractConfig();

    try {
      //@ts-ignore
      const comment = (await readContract({
        ...contractConfig,
        functionName: "getComment",
        args: [commentId],
      })) as any;

      const timestampInMilliseconds = Number(comment.timestamp) * 1000;

      return {
        id: commentId,
        author: comment.author,
        content: comment.commentContent,
        proposalId: comment.proposalId.toString(),
        createdAt: new Date(timestampInMilliseconds),
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
      setIsSuccess(true);
      setIsLoading(false);
    } catch (error) {
      setError("Error fetching comments for the proposal");
    }
  }

  async function getCommentsPerPage(page: number) {
    const start = (page - 1) * COMMENTS_PER_PAGE;
    const end = start + COMMENTS_PER_PAGE;

    const pageCommentsIds = allCommentsIdsPerProposal.slice(start, end);

    try {
      const commentsPromises = pageCommentsIds.map(id => getComment(id));

      const newComments = await Promise.all(commentsPromises);

      const combinedComments = [...comments, ...newComments];
      setComments(combinedComments);
      setCurrentPage(page);
    } catch (error) {
      setError("Error fetching comments for the page");
    }
  }

  async function getAllCommentsIdsPerProposal() {
    setIsLoading(true);
    setComments([]);
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
      const [allCommentsIdsRaw, deletedCommentIdsRaw] = await readContracts({ contracts });

      const allCommentsIdsBigInt = allCommentsIdsRaw.result as bigint[];
      const deletedCommentIdsBigInt = deletedCommentIdsRaw.result as bigint[];

      const deletedCommentIdsSet = new Set(deletedCommentIdsBigInt.map(id => id.toString()));
      const allCommentsIds = allCommentsIdsBigInt.map(id => id.toString()).filter(id => !deletedCommentIdsSet.has(id));

      const commentsForPage = allCommentsIds.slice(0, COMMENTS_PER_PAGE);

      setAllCommentsIdsPerProposal(allCommentsIds);
      setTotalPages(Math.ceil(allCommentsIds.length / COMMENTS_PER_PAGE));
      getCommentsPerProposal(commentsForPage);
    } catch (error) {
      setError("something went wrong while getting all comments ids per proposal");
      setIsSuccess(false);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  }

  async function addComment(content: string) {
    toastLoading("Adding comment...");
    try {
      const contractConfig = await getContractConfig();

      const txResult = await writeContract(
        //@ts-ignore
        await prepareWriteContract({
          ...contractConfig,
          functionName: "comment",
          args: [proposalId, content],
        }),
      );

      const txReceipt = await waitForTransaction({ hash: txResult.hash });
      const blockInfo = await getBlockDetails(txReceipt.blockHash, chainId);

      if (!blockInfo) throw new Error("Error fetching block details");

      const commentId = await getCommentId({
        author: accountAddress ?? "",
        commentContent: content,
        proposalId: proposalId,
        timestamp: blockInfo.timestamp,
      });

      const newComment = await getComment(commentId);
      const combinedComments = [...comments, newComment];

      setComments(combinedComments);
      toastSuccess("Comment added successfully!");
    } catch (error: any) {
      handleError(error.message, "Error adding comment");
      setIsSuccess(false);
      setIsLoading(false);
    }
  }

  async function deleteComments(commentsIds: string[]) {
    setIsDeleting(true);
    try {
      const contractConfig = await getContractConfig();

      const txResult = await writeContract(
        //@ts-ignore
        await prepareWriteContract({
          ...contractConfig,
          functionName: "deleteComments",
          args: [commentsIds],
        }),
      );

      await waitForTransaction({ hash: txResult.hash });

      const newComments = comments.filter(comment => !commentsIds.includes(comment.id));

      setComments(newComments);
      toastSuccess("Comment deleted successfully!");
      setIsDeletingSuccess(true);
      setIsDeleting(false);
    } catch (error: any) {
      handleError(error.message, "Error deleting comment");
      setIsDeletingError(error.message);
      setIsDeleting(false);
    }
  }

  return {
    addComment,
    getAllCommentsIdsPerProposal,
    getCommentsPerPage,
    getCommentId,
    deleteComments,
  };
};

export default useComments;
