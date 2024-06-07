import { formatBalance } from "@helpers/formatBalance";
import { returnOnlySuffix } from "@helpers/ordinalSuffix";
import { FC } from "react";
import { FundPoolToken } from "../../../FundPool/store";

interface CreateRewardsReviewTableProps {
  rankings: number[];
  shareAllocations: number[];
  tokens: FundPoolToken[];
}

const CreateRewardsReviewTable: FC<CreateRewardsReviewTableProps> = ({ rankings, shareAllocations, tokens }) => {
  const handleAmountPerShareAllocation = (amount: number, shareAllocation: number): string => {
    const amountPerShare = (amount / 100) * shareAllocation;
    return formatBalance(amountPerShare.toString());
  };

  return (
    <div className="flex flex-col gap-6">
      <p className="text-[20px] text-neutral-11 font-bold">Rewards Pool for Winners</p>
      <div className="grid gap-4">
        {rankings.map((ranking, rankingIndex) => (
          <div
            key={ranking}
            className="grid rewards-review-table-grid gap-4 items-center text-neutral-14 hover:text-positive-11 transition-colors duration-300"
          >
            <p className="text-[16px]">
              {ranking}
              <sup>{returnOnlySuffix(ranking)}</sup> <span className="ml-1">place</span>
            </p>
            <p className="text-[16px]">{shareAllocations[rankingIndex]}% of rewards</p>
            <div className="flex gap-1 items-center">
              {tokens.map((token, tokenIndex) => (
                <p className="text-[16px]" key={tokenIndex}>
                  {handleAmountPerShareAllocation(parseFloat(token.amount), shareAllocations[rankingIndex])}{" "}
                  <span className="uppercase">{token.symbol}</span>{" "}
                  {tokenIndex + 1 < tokens.length ? <span>,</span> : null}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CreateRewardsReviewTable;
