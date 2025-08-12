import VotingQualifierError from "@components/_pages/Contest/components/StickyCards/components/VotingQualifier/shared/Error";
import VotingQualifierSkeleton from "@components/_pages/Contest/components/StickyCards/components/VotingQualifier/shared/Skeleton";
import { calculateEndPrice } from "@helpers/exponentialMultiplier";
import { formatBalance } from "@helpers/formatBalance";
import { useContestStore } from "@hooks/useContest/store";
import usePriceCurveMultiple from "@hooks/usePriceCurveMultiple";
import { FC } from "react";
import { formatEther } from "viem";
import { useShallow } from "zustand/react/shallow";

const VotingQualifierAnyoneCanVoteExponentialEndPrice: FC = () => {
  const { costToVote, contestInfoData, contestAbi } = useContestStore(
    useShallow(state => ({
      costToVote: state.charge.type.costToVote,
      contestInfoData: state.contestInfoData,
      contestAbi: state.contestAbi,
    })),
  );
  const { priceCurveMultiple, isLoading, isError, refetch } = usePriceCurveMultiple({
    address: contestInfoData.contestAddress,
    abi: contestAbi,
    chainId: contestInfoData.contestChainId,
  });

  if (isLoading) return <VotingQualifierSkeleton />;
  if (isError) return <VotingQualifierError onClick={() => refetch()} />;

  return (
    <p className="text-[16px] md:text-[24px] text-neutral-11 font-bold">
      {formatBalance(formatEther(BigInt(costToVote ?? 0)))} →{" "}
      {formatBalance(formatEther(calculateEndPrice(costToVote ?? 0, Number(priceCurveMultiple))))}
      <span className="text-[16px] md:text-[24px] text-neutral-9 uppercase">
        {contestInfoData.contestChainNativeCurrencySymbol}
      </span>
    </p>
  );
};

export default VotingQualifierAnyoneCanVoteExponentialEndPrice;
