import { formatBalance } from "@helpers/formatBalance";
import { formatNumberAbbreviated } from "@helpers/formatNumber";
import { Charge, VoteType } from "@hooks/useDeployContest/types";
import React from "react";
import { useAccount, useBalance } from "wagmi";

interface MyVotesProps {
  amountOfVotes: number;
  charge: Charge | null;
  chainId?: number;
}

const MyVotes: React.FC<MyVotesProps> = ({ charge, amountOfVotes, chainId }) => {
  const { address } = useAccount();
  const { data: balanceData } = useBalance({
    address,
    chainId,
  });

  const insufficientBalance = charge && balanceData ? balanceData.value < BigInt(charge.type.costToVote) : false;

  return (
    <div
      className={`flex justify-between items-center text-[16px] ${insufficientBalance ? "text-negative-11" : "text-neutral-11"} transition-colors duration-300`}
    >
      <span className="text-neutral-11">my votes:</span>
      <div className="flex items-center gap-2">
        {balanceData && charge?.voteType === VoteType.PerVote && (
          <>
            <span className="text-neutral-14">
              {formatBalance(balanceData.formatted)} {balanceData.symbol}
            </span>
            <span className="text-neutral-14">=</span>
          </>
        )}
        <span className="text-neutral-11">
          {formatNumberAbbreviated(amountOfVotes)} vote{amountOfVotes !== 1 ? "s" : ""}
        </span>
      </div>
    </div>
  );
};

export default MyVotes;
