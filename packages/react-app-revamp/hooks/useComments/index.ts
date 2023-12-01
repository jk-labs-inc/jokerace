import { toastLoading, toastSuccess } from "@components/UI/Toast";
import getContestContractVersion from "@helpers/getContestContractVersion";
import { useError } from "@hooks/useError";
import { prepareWriteContract, readContract, waitForTransaction, writeContract } from "@wagmi/core";
import { Abi } from "viem";
import { useAccount } from "wagmi";
import { Comment, useCommentsStore } from "./store";

const COMMENTS_PER_PAGE = 12;

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
    setIsPaginating,
    setCurrentPage,
    setTotalPages,
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
        author: comment.author,
        content: comment.commentContent,
        proposalId: comment.proposalId.toString(),
        createdAt: new Date(timestampInMilliseconds),
      };
    } catch (error) {
      return {
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
    } catch (error) {
      setError("Error fetching comments for the proposal");
    }
  }

  async function getCommentsPerPage(page: number) {
    setIsPaginating(true);

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

    setIsPaginating(false);
  }

  async function getAllCommentsIdsPerProposal() {
    setIsLoading(true);
    const contractConfig = await getContractConfig();

    try {
      //@ts-ignore
      const allCommentsIdsRaw = (await readContract({
        ...contractConfig,
        functionName: "getProposalComments",
        args: [proposalId],
      })) as bigint[];

      if (!allCommentsIdsRaw.length) return;

      const allCommentsIds = allCommentsIdsRaw.map(id => id.toString());
      const commentsForPage = allCommentsIds.slice(0, COMMENTS_PER_PAGE);

      setAllCommentsIdsPerProposal(allCommentsIds);
      setTotalPages(Math.ceil(allCommentsIds.length / COMMENTS_PER_PAGE));
      getCommentsPerProposal(commentsForPage);
    } catch (error) {
      setError("something went wrong while getting all comments ids per proposal");
      setIsSuccess(false);
      setIsLoading(false);
    }
  }

  async function addComment(content: string) {
    const contractConfig = await getContractConfig();
    toastLoading("Adding comment...");
    try {
      let txRequest;

      //@ts-ignore
      txRequest = await prepareWriteContract({
        ...contractConfig,
        functionName: "comment",
        args: [proposalId, content],
      });

      //@ts-ignore
      const hash = await writeContract(txRequest);

      await waitForTransaction({
        hash,
      });

      const newComment: Comment = {
        author: accountAddress as `0x${string}`,
        content: content,
        proposalId: proposalId,
        createdAt: new Date(),
      };

      const combinedComments = [...comments, newComment];

      setComments(combinedComments);
      toastSuccess("Comment added successfully!");
    } catch (error: any) {
      handleError(error, "Error adding comment");
      setIsSuccess(false);
      setIsLoading(false);
    }
  }

  return {
    addComment,
    getAllCommentsIdsPerProposal,
    getCommentsPerPage,
  };
};

export default useComments;
