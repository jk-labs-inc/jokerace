import { Abi } from "viem";
import { useReadContracts } from "wagmi";

interface UseNumberOfCommentsProps {
  contestAddress: string;
  contestChainId: number;
  contestAbi: Abi;
  proposalId: string;
}

interface UseNumberOfCommentsResult {
  numberOfComments: number | undefined;
  isLoading: boolean;
  isError: boolean;
}

const useNumberOfComments = ({
  contestAddress,
  contestChainId,
  contestAbi,
  proposalId,
}: UseNumberOfCommentsProps): UseNumberOfCommentsResult => {
  const {
    data: numberOfComments,
    isLoading,
    isError,
  } = useReadContracts({
    contracts: [
      {
        address: contestAddress as `0x${string}`,
        abi: contestAbi,
        chainId: contestChainId,
        functionName: "getProposalComments",
        args: [proposalId],
      },
      {
        address: contestAddress as `0x${string}`,
        abi: contestAbi,
        chainId: contestChainId,
        functionName: "getAllDeletedCommentIds",
        args: [],
      },
    ],
    query: {
      enabled: !!contestAddress && !!contestAbi && !!contestChainId && !!proposalId,
      select: data => {
        const allCommentsIdsBigInt = data[0]?.result as bigint[] | undefined;
        const deletedCommentIdsBigInt = data[1]?.result as bigint[] | undefined;

        if (!allCommentsIdsBigInt || !deletedCommentIdsBigInt) {
          return 0;
        }

        const deletedCommentIdsSet = new Set(deletedCommentIdsBigInt);
        return allCommentsIdsBigInt.filter(id => !deletedCommentIdsSet.has(id)).length;
      },
    },
  });

  return { numberOfComments, isLoading, isError };
};

export default useNumberOfComments;
