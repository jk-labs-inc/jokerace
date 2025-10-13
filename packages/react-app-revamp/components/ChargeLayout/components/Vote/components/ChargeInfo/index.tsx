import { FC } from "react";
import ChargeInfoContainer from "./components/Container";
import ChargeInfoCurve from "./components/Curve";
import usePriceCurveType from "@hooks/usePriceCurveType";
import useContestConfigStore from "@hooks/useContestConfig/store";
import { useShallow } from "zustand/shallow";
import VotingQualifierError from "@components/_pages/Contest/components/StickyCards/components/VotingQualifier/shared/Error";
import VotingQualifierSkeleton from "@components/_pages/Contest/components/StickyCards/components/VotingQualifier/shared/Skeleton";
import { PriceCurveType } from "@hooks/useDeployContest/types";
import ChargeInfoExponentialPercentageIncrease from "./components/ExponentialPercentageIncrease";
import { ArrowTrendingUpIcon } from "@heroicons/react/24/outline";

interface ChargeInfoProps {
  costToVote: string;
  costToVoteRaw: bigint;
}

const ChargeInfo: FC<ChargeInfoProps> = ({ costToVote, costToVoteRaw }) => {
  const { contestConfig } = useContestConfigStore(useShallow(state => state));
  const { priceCurveType, isLoading, isError, refetch } = usePriceCurveType({
    address: contestConfig.address,
    abi: contestConfig.abi,
    chainId: contestConfig.chainId,
  });

  if (isLoading) return <VotingQualifierSkeleton />;

  if (isError) return <VotingQualifierError onClick={() => refetch()} />;

  return (
    <div className="flex flex-col gap-1">
      <ChargeInfoContainer className="text-neutral-9">
        <div className="flex items-center gap-1">
          <p>price per vote</p>
          {priceCurveType === PriceCurveType.Exponential && <ArrowTrendingUpIcon className="w-4 h-4 text-neutral-9" />}
        </div>
        <ChargeInfoCurve costToVote={costToVote} priceCurveType={priceCurveType} />
      </ChargeInfoContainer>
      {priceCurveType === PriceCurveType.Exponential && (
        <ChargeInfoExponentialPercentageIncrease costToVote={costToVoteRaw} />
      )}
    </div>
  );
};

export default ChargeInfo;
