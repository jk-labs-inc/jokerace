import { formatBalance } from "@helpers/formatBalance";
import { formatNumberAbbreviated } from "@helpers/formatNumber";
import React from "react";
import { GetBalanceData } from "wagmi/query";

interface MyVotesProps {
  amountOfVotes: number;
  balanceData: GetBalanceData | undefined;
  costToVote: number;
  onAddFunds?: () => void;
}

const MyVotes: React.FC<MyVotesProps> = ({ costToVote, balanceData, amountOfVotes, onAddFunds }) => {
  const insufficientBalance = balanceData ? balanceData.value < BigInt(costToVote) : false;

  return (
    <div
      className={`flex justify-between items-center text-[16px] ${
        insufficientBalance ? "text-negative-11" : "text-neutral-11"
      } transition-colors duration-300`}
    >
      <p className="text-neutral-9">
        my wallet{" "}
        {!insufficientBalance ? (
          <>
            {" "}
            <span className="mx-1">|</span>{" "}
            <button onClick={onAddFunds} className="text-positive-11">
              add funds
            </button>
          </>
        ) : null}
      </p>
      <div className="flex items-center gap-2">
        {balanceData ? (
          <span className="text-neutral-9">
            {formatBalance(balanceData.formatted)} {balanceData.symbol}
          </span>
        ) : (
          <span className="text-neutral-9">
            {formatNumberAbbreviated(amountOfVotes)} vote{amountOfVotes !== 1 ? "s" : ""}
          </span>
        )}
      </div>
    </div>
  );
};

export default MyVotes;
