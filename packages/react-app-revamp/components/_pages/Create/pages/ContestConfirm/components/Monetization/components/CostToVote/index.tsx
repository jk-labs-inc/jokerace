import { PriceCurve, PriceCurveType, VoteType } from "@hooks/useDeployContest/types";
import { FC } from "react";

interface CostToVoteMessageProps {
  costToVote: number;
  priceCurve: PriceCurve;
  voteType: VoteType;
  costToVoteStartPrice?: number;
  costToVoteEndPrice?: number;
  nativeCurrencySymbol?: string;
}

const CostToVoteMessage: FC<CostToVoteMessageProps> = ({
  costToVote,
  priceCurve,
  costToVoteStartPrice,
  costToVoteEndPrice,
  nativeCurrencySymbol,
  voteType,
}) => {
  if (priceCurve.type === PriceCurveType.Exponential) {
    return (
      <li className="text-[16px]">
        {costToVoteStartPrice} <span className="uppercase">${nativeCurrencySymbol}</span> (at start) to{" "}
        {costToVoteEndPrice} (at finish)
        <span className="uppercase"> ${nativeCurrencySymbol}</span> per vote
      </li>
    );
  }
  return (
    <li className="text-[16px]">
      {costToVote} <span className="uppercase">${nativeCurrencySymbol}</span>{" "}
      {voteType === VoteType.PerVote ? "for each" : "to"} vote
    </li>
  );
};

export default CostToVoteMessage;
