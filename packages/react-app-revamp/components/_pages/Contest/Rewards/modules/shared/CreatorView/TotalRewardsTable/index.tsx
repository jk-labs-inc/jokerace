import RewardsNumberDisplay from "@components/_pages/Contest/Rewards/components/UI/Display/Number";
import { formatBalance } from "@helpers/formatBalance";
import { returnOnlySuffix } from "@helpers/ordinalSuffix";
import { RankShare, TotalRewardsData } from "lib/rewards/types";
import { formatUnits } from "viem";

interface TotalRewardsTableProps {
  totalRewards: TotalRewardsData;
  shares: RankShare[];
}

const TotalRewardsTable = ({ totalRewards, shares }: TotalRewardsTableProps) => {
  const totalSharesValue = shares.reduce((acc, { share }) => acc + share, 0n);
  const { value: totalValue, symbol, decimals } = totalRewards?.native || { value: 0n, symbol: "ETH", decimals: 18 };

  const tokenEntries = Object.entries(totalRewards?.tokens || {});

  const ranksWithPercentage = shares.map(({ rank, share }) => {
    const percentage = totalSharesValue > 0n ? Number((share * 100n) / totalSharesValue) : 0;

    const rewardValue = totalSharesValue > 0n ? (totalValue * share) / totalSharesValue : 0n;
    const formattedReward = formatBalance(formatUnits(rewardValue, decimals));

    const tokenRewards = tokenEntries.map(([address, tokenData]) => {
      const tokenRewardValue = totalSharesValue > 0n ? (tokenData.value * share) / totalSharesValue : 0n;
      const formattedTokenReward = formatBalance(formatUnits(tokenRewardValue, tokenData.decimals));

      return {
        address,
        symbol: tokenData.symbol,
        amount: formattedTokenReward,
        decimals: tokenData.decimals,
      };
    });

    return {
      rank,
      percentage,
      rewardAmount: formattedReward,
      tokenRewards,
    };
  });

  ranksWithPercentage.sort((a, b) => a.rank - b.rank);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <RewardsNumberDisplay value={totalValue} symbol={symbol} decimals={decimals} index={0} isBold={true} />

        {tokenEntries.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tokenEntries.map(([address, tokenData], index) => (
              <RewardsNumberDisplay
                key={address}
                value={tokenData.value}
                symbol={tokenData.symbol}
                decimals={tokenData.decimals}
                index={index + 1}
                isBold={true}
              />
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2">
        {ranksWithPercentage.map(({ rank, percentage, rewardAmount, tokenRewards }, idx) => (
          <div
            key={rank}
            className={`flex flex-col gap-2 text-neutral-9 ${idx !== ranksWithPercentage.length - 1 ? "border-b border-primary-2 pb-2" : ""}`}
          >
            <div className="flex justify-between items-center text-[16px] font-bold">
              <div>
                {rank}
                <sup>{returnOnlySuffix(rank)}</sup> place voters ({percentage}%)
              </div>
              <div>
                {rewardAmount} <span className="text-[12px] text-neutral-9 font-bold">{symbol}</span>
              </div>
            </div>

            {tokenRewards.length > 0 && (
              <div className="flex flex-wrap gap-2 justify-end">
                {tokenRewards.map((tokenReward, index) => (
                  <div key={tokenReward.address} className="text-[14px] font-bold">
                    {tokenReward.amount}{" "}
                    <span className="text-[10px] text-neutral-9 font-bold">{tokenReward.symbol}</span>
                    {index < tokenRewards.length - 1 ? ", " : ""}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TotalRewardsTable;
