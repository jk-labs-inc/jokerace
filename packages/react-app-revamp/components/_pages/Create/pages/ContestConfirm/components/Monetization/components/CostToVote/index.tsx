import { formatBalance } from "@helpers/formatBalance";
import { FC } from "react";

interface CostToVoteMessageProps {
  costToVote?: number;
  costToVoteEndPrice?: number;
  nativeCurrencySymbol?: string;
}

const CostToVoteMessage: FC<CostToVoteMessageProps> = ({ costToVote, costToVoteEndPrice, nativeCurrencySymbol }) => {
  return (
    <li className="text-[16px]">
      {formatBalance(costToVote?.toString() ?? "0")} <span className="uppercase">${nativeCurrencySymbol}</span> (at
      start) to {formatBalance(costToVoteEndPrice?.toString() ?? "0")} (at finish)
      <span className="uppercase"> ${nativeCurrencySymbol}</span> per vote
    </li>
  );
};

export default CostToVoteMessage;
