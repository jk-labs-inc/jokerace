import { useReadContract } from "wagmi";
import { useConnection } from "wagmi";

interface UseHasSubmittedProposalProps {
  contractAddress: `0x${string}`;
  chainId: number;
  abi: any;
  address?: `0x${string}`;
}

const useHasSubmittedProposal = ({ contractAddress, chainId, abi, address }: UseHasSubmittedProposalProps) => {
  const { address: accountAddress } = useConnection();
  const addressToCheck = address || accountAddress;

  const submissionCount = useReadContract({
    address: contractAddress,
    abi: abi,
    chainId: chainId,
    functionName: "numSubmissions",
    args: [addressToCheck as `0x${string}`],
    query: {
      select: (data: unknown) => {
        return (data as bigint) > 0n;
      },
      enabled: !!contractAddress && !!abi && !!chainId && !!addressToCheck,
    },
  });

  return {
    hasSubmitted: submissionCount.data || false,
    isLoading: submissionCount.isLoading,
    isError: submissionCount.isError,
    error: submissionCount.error,
    refetch: submissionCount.refetch,
  };
};

export default useHasSubmittedProposal;
