import { Abi } from "viem";
import { useExponentialCurveCost } from "./useExponentialCurveCost";

interface UseCurrentPricePerVoteParams {
  address: string;
  abi: Abi;
  chainId: number;
  votingClose: Date;
  enabled?: boolean;
}

interface UseCurrentPricePerVoteReturn {
  currentPricePerVote: string;
  currentPricePerVoteRaw: bigint;
  isLoading: boolean;
  isError: boolean;
}

const useCurrentPricePerVote = ({
  address,
  abi,
  chainId,
  votingClose,
  enabled = true,
}: UseCurrentPricePerVoteParams): UseCurrentPricePerVoteReturn => {
  const exponentialCurveCost = useExponentialCurveCost({
    address,
    abi,
    chainId,
    votingClose,
    enabled,
  });

  const isLoading = exponentialCurveCost.isLoading;
  const isError = exponentialCurveCost.isError;
  const currentPricePerVote = exponentialCurveCost.costToVote;
  const currentPricePerVoteRaw = exponentialCurveCost.costToVoteRaw;

  return {
    currentPricePerVote,
    currentPricePerVoteRaw,
    isLoading,
    isError,
  };
};

export default useCurrentPricePerVote;
