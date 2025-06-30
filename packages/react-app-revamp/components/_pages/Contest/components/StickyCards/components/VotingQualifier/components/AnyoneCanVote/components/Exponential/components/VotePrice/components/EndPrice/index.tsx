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
      costToVote: state?.charge?.type.costToVote,
      contestInfoData: state.contestInfoData,
      contestAbi: state.contestAbi,
    })),
  );
  const { priceCurveMultiple, isLoading, isError } = usePriceCurveMultiple({
    address: contestInfoData.contestAddress,
    abi: contestAbi,
    chainId: contestInfoData.contestChainId,
  });

  //TODO: add loading
  if (isLoading) return <p className="text-[24px] text-neutral-11 font-bold">Loading...</p>;
  if (isError) return <p className="text-[24px] text-neutral-11 font-bold">Error</p>;

  return (
    <p className="text-[16px] md:text-[24px] text-neutral-11 font-bold">
      {/* //TODO: add formatting */}
      {formatBalance(formatEther(BigInt(costToVote ?? 0)))} -{" "}
      {formatBalance(formatEther(calculateEndPrice(costToVote ?? 0, Number(priceCurveMultiple))))}
      <span className="text-[16px] text-neutral-9"> {contestInfoData.contestChainNativeCurrencySymbol}</span>
    </p>
  );
};

export default VotingQualifierAnyoneCanVoteExponentialEndPrice;
