import { formatBalance } from "@helpers/formatBalance";
import { useContestStore } from "@hooks/useContest/store";
import { formatEther } from "viem";
import { compareVersions } from "compare-versions";
import { VOTING_PRICE_CURVES_VERSION } from "constants/versions";
import { useShallow } from "zustand/shallow";
import usePriceCurveMultiple from "@hooks/usePriceCurveMultiple";
import VotingQualifierSkeleton from "@components/_pages/Contest/components/StickyCards/components/VotingQualifier/shared/Skeleton";
import VotingQualifierError from "@components/_pages/Contest/components/StickyCards/components/VotingQualifier/shared/Error";
import usePriceCurveType from "@hooks/usePriceCurveType";
import { PriceCurveType, VoteType } from "@hooks/useDeployContest/types";
import { calculateEndPrice } from "lib/priceCurve";

const ContestParametersVotingPrice = () => {
  const { version, charge, contestInfoData, contestAbi } = useContestStore(
    useShallow(state => ({
      version: state.version,
      charge: state.charge,
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

  if (!isVotingPriceCurveEnabled || priceCurveType !== PriceCurveType.Exponential) {
    return (
      <li className="list-disc">
        {formatEther(BigInt(charge.type.costToVote))} {contestInfoData.contestChainNativeCurrencySymbol}
        {charge.voteType === VoteType.PerVote ? " per vote" : " to vote"}
      </li>
    );
  }

  return (
    <li className="list-disc">
      {formatBalance(formatEther(BigInt(charge.type.costToVote)))} {contestInfoData.contestChainNativeCurrencySymbol}{" "}
      (at start) to {formatBalance(formatEther(calculateEndPrice(charge.type.costToVote, Number(priceCurveMultiple))))}{" "}
      {contestInfoData.contestChainNativeCurrencySymbol} (at finish) per vote
    </li>
  );
};

export default ContestParametersVotingPrice;
