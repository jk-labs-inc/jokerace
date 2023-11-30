import getContestContractVersion from "@helpers/getContestContractVersion";
import { Comment, useCommentsStore } from "./store";
import { Abi } from "viem";
import { readContract } from "@wagmi/core";

const COMMENTS_PER_PAGE = 12;

const useComments = (address: string, chainId: number, proposalId: string) => {
  const {
    setIsLoading,
    setIsSuccess,
    setError,
    setComments,
    allCommentsIdsPerProposal,
    setAllCommentsIdsPerProposal,
    setIsPaginating,
    setCurrentPage,
    setTotalPages,
  } = useCommentsStore(state => state);

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

      return {
        author: comment.author,
        content: comment.content,
        proposalId: comment.proposalId,
        timestamp: comment.timestamp,
      };
    } catch (error) {
      return {
        author: "",
        content: `Failed to load comment ${commentId}`,
        proposalId: "",
        timestamp: 0,
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
      const comments = await Promise.all(commentsPromises);

      setComments((prevComments: Comment[]) => [...prevComments, ...comments]);
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

    try {
      //@ts-ignore
      const comment = (await readContract({
        ...contractConfig,
        functionName: "comment",
        args: [proposalId, content],
      })) as any;
    } catch (error) {
      setError("something went wrong while adding comment");
      setIsSuccess(false);
      setIsLoading(false);
    }
  }
};

export default useComments;
