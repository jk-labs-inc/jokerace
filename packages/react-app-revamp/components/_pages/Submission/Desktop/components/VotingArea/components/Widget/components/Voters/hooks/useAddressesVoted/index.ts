import { Abi } from "viem";
import { useReadContract } from "wagmi";

interface UseAddressesVotedProps {
  contestAddress: string;
  contestAbi: Abi;
  contestChainId: number;
  proposalId: string;
  enabled?: boolean;
}

interface UseAddressesVotedReturn {
  addressesVoted: string[];
  isLoadingAddressesVoted: boolean;
  isErrorAddressesVoted: boolean;
  refetchAddressesVoted: () => void;
}

export const useAddressesVoted = ({
  contestAddress,
  contestAbi,
  contestChainId,
  proposalId,
  enabled = true,
}: UseAddressesVotedProps): UseAddressesVotedReturn => {
  const {
    data: addressesVoted,
    isLoading: isLoadingAddressesVoted,
    isError: isErrorAddressesVoted,
    refetch: refetchAddressesVoted,
  } = useReadContract({
    address: contestAddress as `0x${string}`,
    abi: contestAbi,
    chainId: contestChainId,
    functionName: "proposalAddressesHaveVoted",
    args: [proposalId],
    query: {
      enabled: !!contestAddress && !!contestAbi && !!contestChainId && !!proposalId && enabled,
    },
  });

  return {
    addressesVoted: addressesVoted as string[],
    isLoadingAddressesVoted,
    isErrorAddressesVoted,
    refetchAddressesVoted,
  };
};
