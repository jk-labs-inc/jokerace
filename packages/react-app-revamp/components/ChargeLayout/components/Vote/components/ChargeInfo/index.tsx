import { ArrowTrendingUpIcon } from "@heroicons/react/24/outline";
import { FC } from "react";
import ChargeInfoContainer from "./components/Container";
import ChargeInfoCurve from "./components/Curve";
import ChargeInfoExponentialPercentageIncrease from "./components/ExponentialPercentageIncrease";

interface ChargeInfoProps {
  costToVote: string;
  costToVoteRaw: bigint;
}

const ChargeInfo: FC<ChargeInfoProps> = ({ costToVote, costToVoteRaw }) => {
  return (
    <div className="flex flex-col gap-1">
      <ChargeInfoContainer className="text-neutral-9">
        <div className="flex items-center gap-1">
          <p>price per vote</p>
          <ArrowTrendingUpIcon className="w-4 h-4 text-neutral-9" />
        </div>
        <ChargeInfoCurve costToVote={costToVote} />
      </ChargeInfoContainer>
      <ChargeInfoExponentialPercentageIncrease costToVote={costToVoteRaw} />
    </div>
  );
};

export default ChargeInfo;
