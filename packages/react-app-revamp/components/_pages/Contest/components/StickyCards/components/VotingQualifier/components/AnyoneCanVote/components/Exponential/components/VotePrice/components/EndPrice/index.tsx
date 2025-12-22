import VotingQualifierError from "@components/_pages/Contest/components/StickyCards/components/VotingQualifier/shared/Error";
import VotingQualifierSkeleton from "@components/_pages/Contest/components/StickyCards/components/VotingQualifier/shared/Skeleton";
import { formatBalance } from "@helpers/formatBalance";
import { useContestStore } from "@hooks/useContest/store";
import useContestConfigStore from "@hooks/useContestConfig/store";
import usePriceCurveMultiple from "@hooks/usePriceCurveMultiple";
import { calculateEndPrice } from "lib/priceCurve";
import { FC } from "react";
import { formatEther } from "viem";
import { useShallow } from "zustand/shallow";

const VotingQualifierAnyoneCanVoteExponentialEndPrice: FC = () => {
  const { contestConfig } = useContestConfigStore(useShallow(state => state));
  const { costToVote } = useContestStore(
    useShallow(state => ({
      costToVote: state.charge.costToVote,
    })),
  );
  const { priceCurveMultiple, isLoading, isError, refetch } = usePriceCurveMultiple({
    address: contestConfig.address,
    abi: contestConfig.abi,
    chainId: contestConfig.chainId,
  });

  if (isLoading) return <VotingQualifierSkeleton />;
  if (isError) return <VotingQualifierError onClick={() => refetch()} />;

  return (
    <p className="text-[16px] md:text-[24px] text-neutral-11 font-bold">
      {formatBalance(formatEther(BigInt(costToVote ?? 0)))} →{" "}
      {formatBalance(formatEther(calculateEndPrice(costToVote ?? 0, Number(priceCurveMultiple))))}
      <span className="text-[16px] md:text-[24px] text-neutral-9 uppercase">
        {contestConfig.chainNativeCurrencySymbol}
      </span>
    </p>
  );
};

export default VotingQualifierAnyoneCanVoteExponentialEndPrice;
