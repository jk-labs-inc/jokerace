import VotingQualifierError from "@components/_pages/Contest/components/StickyCards/components/VotingQualifier/shared/Error";
import VotingQualifierSkeleton from "@components/_pages/Contest/components/StickyCards/components/VotingQualifier/shared/Skeleton";
import { formatBalance } from "@helpers/formatBalance";
import { useContestStore } from "@hooks/useContest/store";
import useContestConfigStore from "@hooks/useContestConfig/store";
import { PriceCurveType, VoteType } from "@hooks/useDeployContest/types";
import usePriceCurveMultiple from "@hooks/usePriceCurveMultiple";
import usePriceCurveType from "@hooks/usePriceCurveType";
import { compareVersions } from "compare-versions";
import { VOTING_PRICE_CURVES_VERSION } from "constants/versions";
import { calculateEndPrice } from "lib/priceCurve";
import { formatEther } from "viem";
import { useShallow } from "zustand/shallow";

const ContestParametersVotingPrice = () => {
  const { contestConfig } = useContestConfigStore(useShallow(state => state));
  const { charge } = useContestStore(
    useShallow(state => ({
      charge: state.charge,
    })),
  );
  const isVotingPriceCurveEnabled = compareVersions(contestConfig.version, VOTING_PRICE_CURVES_VERSION) >= 0;

  const {
    priceCurveMultiple,
    isLoading: isPriceCurveMultipleLoading,
    isError: isPriceCurveMultipleError,
    refetch: refetchPriceCurveMultiple,
  } = usePriceCurveMultiple({
    address: contestConfig.address,
    abi: contestConfig.abi,
    chainId: contestConfig.chainId,
    enabled: isVotingPriceCurveEnabled,
  });

  const {
    priceCurveType,
    isLoading: isPriceCurveTypeLoading,
    isError: isPriceCurveTypeError,
    refetch: refetchPriceCurveType,
  } = usePriceCurveType({
    address: contestConfig.address,
    abi: contestConfig.abi,
    chainId: contestConfig.chainId,
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
        {formatEther(BigInt(charge.type.costToVote))} {contestConfig.chainNativeCurrencySymbol}
        {charge.voteType === VoteType.PerVote ? " per vote" : " to vote"}
      </li>
    );
  }

  return (
    <li className="list-disc">
      {formatBalance(formatEther(BigInt(charge.type.costToVote)))} {contestConfig.chainNativeCurrencySymbol} (at start)
      to {formatBalance(formatEther(calculateEndPrice(charge.type.costToVote, Number(priceCurveMultiple))))}{" "}
      {contestConfig.chainNativeCurrencySymbol} (at finish) per vote
    </li>
  );
};

export default ContestParametersVotingPrice;
