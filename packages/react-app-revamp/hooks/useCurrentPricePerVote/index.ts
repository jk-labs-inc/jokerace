import { PriceCurveType } from "@hooks/useDeployContest/types";
import usePriceCurveType from "@hooks/usePriceCurveType";
import { Abi } from "viem";
import { useFlatCurveCost } from "./useFlatCurveCost";
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
  const {
    priceCurveType,
    isLoading: isCurveTypeLoading,
    isError: isCurveTypeError,
  } = usePriceCurveType({
    address,
    abi,
    chainId,
    enabled,
  });

  const isExponential = priceCurveType === PriceCurveType.Exponential;

  const flatCurveCost = useFlatCurveCost({
    address,
    abi,
    chainId,
    enabled: enabled && !isCurveTypeLoading && !isExponential,
  });

  const exponentialCurveCost = useExponentialCurveCost({
    address,
    abi,
    chainId,
    votingClose,
    enabled: enabled && !isCurveTypeLoading && isExponential,
  });

  const isLoading = isCurveTypeLoading || (isExponential ? exponentialCurveCost.isLoading : flatCurveCost.isLoading);
  const isError = isCurveTypeError || (isExponential ? exponentialCurveCost.isError : flatCurveCost.isError);
  const currentPricePerVote = isExponential ? exponentialCurveCost.costToVote : flatCurveCost.costToVote;
  const currentPricePerVoteRaw = isExponential ? exponentialCurveCost.costToVoteRaw : flatCurveCost.costToVoteRaw;

  return {
    currentPricePerVote,
    currentPricePerVoteRaw,
    isLoading,
    isError,
  };
};

export default useCurrentPricePerVote;
