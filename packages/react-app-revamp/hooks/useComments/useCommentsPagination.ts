import { useError } from "@hooks/useError";
import { readContracts } from "@wagmi/core";
import { useCommentsContract } from "./useCommentsContract";
import { useCommentsFetch } from "./useCommentsFetch";
import { useCommentsStore } from "./store";

export const COMMENTS_PER_PAGE = 4;

/**
 * Hook for handling comments pagination logic
 * @param address - Contest contract address
 * @param chainId - Chain ID for the contest
 * @param proposalId - Proposal ID for filtering comments
 */
export const useCommentsPagination = (address: string, chainId: number, proposalId: string) => {
  const { getContractConfig, config } = useCommentsContract(address, chainId);
  const { getCommentsPerProposal } = useCommentsFetch(address, chainId);
  const { handleError } = useError();

  const {
    setIsLoading,
    setIsSuccess,
    setIsError,
    setComments,
    comments,
    allCommentsIdsPerProposal,
    setAllCommentsIdsPerProposal,
    setCurrentPage,
    setTotalPages,
    setIsPaginating,
    setIsPaginatingError,
    setIsPaginatingSuccess,
  } = useCommentsStore(state => state);

  const getCommentsPerPage = async (page: number) => {
    setIsPaginating(true);
    setCurrentPage(page);
    const start = (page - 1) * COMMENTS_PER_PAGE;
    const end = start + COMMENTS_PER_PAGE;

    const pageCommentsIds = allCommentsIdsPerProposal.slice(start, end);

    try {
      const newComments = await getCommentsPerProposal(pageCommentsIds);
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
  };

  const getAllCommentsIdsPerProposal = async () => {
    setIsLoading(true);
    setComments([]);
    setCurrentPage(1);
    const contractConfig = getContractConfig();

    if (!contractConfig) {
      setIsError(true);
      setIsSuccess(false);
      setIsLoading(false);
      return;
    }

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

      const fetchedComments = await getCommentsPerProposal(commentsForPage);
      setComments(fetchedComments);

      setIsLoading(false);
      setIsSuccess(true);
    } catch (error: any) {
      handleError(error.message, "Error fetching all comments ids per proposal");
      setIsError(true);
      setIsSuccess(false);
      setIsLoading(false);
    }
  };

  const getCommentsWithSpecificFirst = async (commentId: string) => {
    setIsLoading(true);
    setComments([]);
    setCurrentPage(1);
    const contractConfig = getContractConfig();

    if (!contractConfig) {
      setIsError(true);
      setIsSuccess(false);
      setIsLoading(false);
      return;
    }

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

      const fetchedComments = await getCommentsPerProposal(commentsForPage);
      setComments(fetchedComments);

      setIsLoading(false);
      setIsSuccess(true);
    } catch (error: any) {
      handleError(error.message, "Error fetching comments with specific first");
      setIsError(true);
      setIsSuccess(false);
      setIsLoading(false);
    }
  };

  return {
    getAllCommentsIdsPerProposal,
    getCommentsWithSpecificFirst,
    getCommentsPerPage,
  };
};
