import { Abi } from "viem";
import { useReadContract } from "wagmi";
import { ProposalCore } from "@hooks/useProposal/store";

interface UseEntryDataProps {
  contestAddress: string;
  contestChainId: number;
  contestAbi: Abi;
  proposalId: string;
}

const useEntryData = ({ contestAddress, contestChainId, contestAbi, proposalId }: UseEntryDataProps) => {
  const {
    data: proposalData,
    isLoading: isLoadingProposal,
    isError: isErrorProposal,
  } = useReadContract({
    address: contestAddress as `0x${string}`,
    abi: contestAbi,
    functionName: "getProposal",
    args: [proposalId],
    chainId: contestChainId,
    query: {
      staleTime: Infinity,
    },
  });

  return {
    proposalData: proposalData as ProposalCore | undefined,
    isLoadingProposal,
    isErrorProposal,
  };
};

export default useEntryData;
