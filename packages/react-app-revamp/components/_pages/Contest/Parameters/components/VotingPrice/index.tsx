import { formatBalance } from "@helpers/formatBalance";
import { useContestStore } from "@hooks/useContest/store";
import { formatEther } from "viem";
import { compareVersions } from "compare-versions";
import { VOTING_PRICE_CURVES_VERSION } from "constants/versions";
import { calculateEndPrice } from "@helpers/exponentialMultiplier";
import { useShallow } from "zustand/shallow";
import usePriceCurveMultiple from "@hooks/usePriceCurveMultiple";
import VotingQualifierSkeleton from "@components/_pages/Contest/components/StickyCards/components/VotingQualifier/shared/Skeleton";
import VotingQualifierError from "@components/_pages/Contest/components/StickyCards/components/VotingQualifier/shared/Error";
import usePriceCurveType from "@hooks/usePriceCurveType";
import { PriceCurveType } from "@hooks/useDeployContest/types";

const ContestParametersVotingPrice = () => {
  const { version, costToVote, contestInfoData, contestAbi } = useContestStore(
    useShallow(state => ({
      version: state.version,
      costToVote: state.charge?.type.costToVote,
      contestInfoData: state.contestInfoData,
      contestAbi: state.contestAbi,
    })),
  );
  const isVotingPriceCurveEnabled = compareVersions(version, VOTING_PRICE_CURVES_VERSION) >= 0;

  const {
    priceCurveMultiple,
    isLoading: isPriceCurveMultipleLoading,
    isError: isPriceCurveMultipleError,
    refetch: refetchPriceCurveMultiple,
  } = usePriceCurveMultiple({
    address: contestInfoData.contestAddress,
    abi: contestAbi,
    chainId: contestInfoData.contestChainId,
    enabled: isVotingPriceCurveEnabled,
  });

  const {
    priceCurveType,
    isLoading: isPriceCurveTypeLoading,
    isError: isPriceCurveTypeError,
    refetch: refetchPriceCurveType,
  } = usePriceCurveType({
    address: contestInfoData.contestAddress,
    abi: contestAbi,
    chainId: contestInfoData.contestChainId,
    enabled: isVotingPriceCurveEnabled,
  });

  if (isPriceCurveTypeLoading || isPriceCurveMultipleLoading) return <VotingQualifierSkeleton />;
  if (isPriceCurveTypeError || isPriceCurveMultipleError)
    return (
      <VotingQualifierError
        onClick={() => (isPriceCurveTypeError ? refetchPriceCurveType() : refetchPriceCurveMultiple())}
      />
    );

  if (!isVotingPriceCurveEnabled || priceCurveType !== PriceCurveType.Exponential) return null;

  return (
    <li className="list-disc">
      {formatBalance(formatEther(BigInt(costToVote ?? 0)))} {contestInfoData.contestChainNativeCurrencySymbol} (at
      start) to {formatBalance(formatEther(calculateEndPrice(costToVote ?? 0, Number(priceCurveMultiple))))}{" "}
      {contestInfoData.contestChainNativeCurrencySymbol} (at finish) per vote
    </li>
  );
};

export default ContestParametersVotingPrice;
