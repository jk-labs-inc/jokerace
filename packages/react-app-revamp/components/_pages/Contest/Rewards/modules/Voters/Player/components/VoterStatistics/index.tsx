import { extractPathSegments } from "@helpers/extractPath";
import { formatBalance } from "@helpers/formatBalance";
import { getChainId } from "@helpers/getChainId";
import { useRewardsStore } from "@hooks/useRewards/store";
import { useTotalRewardsForRank } from "@hooks/useTotalRewardsForRank";
import { useVoterRewardsStatistics } from "@hooks/useVoterRewardsStatistics";
import { usePathname } from "next/navigation";
import { FC } from "react";
import { formatUnits } from "viem";
import { useShallow } from "zustand/shallow";
import StatisticsRow from "./components/StatisticsRow";
import StatisticsSkeleton from "./components/StatisticsSkeleton";
import RankingSuffix from "./components/RankingSuffix";

interface VoterStatisticsProps {
  ranking: number;
  myReward: {
    value: bigint;
    symbol: string;
    decimals: number;
  };
}

const VoterStatistics: FC<VoterStatisticsProps> = ({ ranking, myReward }) => {
  const asPath = usePathname();
  const { address: contestAddress, chainName } = extractPathSegments(asPath);
  const chainId = getChainId(chainName);
  const { rewards } = useRewardsStore(useShallow(state => state));
  const { statistics, isLoading, isError } = useVoterRewardsStatistics(
    contestAddress,
    rewards.contractAddress,
    ranking,
    chainId ?? 0,
  );

  const {
    data: totalRewardsForRank,
    isLoading: isTotalRewardsForRankLoading,
    isError: isTotalRewardsForRankError,
  } = useTotalRewardsForRank({
    rewardsModuleAddress: rewards.contractAddress as `0x${string}`,
    rewardsModuleAbi: rewards.abi,
    chainId: chainId ?? 0,
    ranking,
  });

  if (isLoading || isTotalRewardsForRankLoading) return <StatisticsSkeleton />;

  // TODO: Add error handling unified
  if (isError || isTotalRewardsForRankError) return <div>Error</div>;

  if (!statistics) return null;

  const renderTotalRewards = () => (
    <div className="flex flex-col items-end font-bold">
      <span>
        {formatBalance(totalRewardsForRank?.native.formatted ?? "0")} {totalRewardsForRank?.native.symbol}
      </span>
      {Object.entries(totalRewardsForRank?.tokens ?? {}).map(([address, token]) => (
        <span key={address}>
          {formatBalance(token.formatted ?? "0")} {token.symbol}
        </span>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col w-full text-neutral-9 gap-2">
      <StatisticsRow
        label={<RankingSuffix ranking={ranking} text="place voter rewards" />}
        value={renderTotalRewards()}
      />

      <StatisticsRow
        label={<RankingSuffix ranking={ranking} text="place" prefix="my votes on" />}
        value={<b>{formatBalance(statistics.userVotesFormatted)}</b>}
      />

      <StatisticsRow
        label={<RankingSuffix ranking={ranking} text="place" prefix="total votes on" />}
        value={<b>{formatBalance(statistics.totalVotesFormatted)}</b>}
      />

      <StatisticsRow
        label={<RankingSuffix ranking={ranking} text="place rewards" prefix="my % of" />}
        value={<b>{statistics.rewardsPercentage}%</b>}
      />

      <StatisticsRow
        label={<RankingSuffix ranking={ranking} text="place rewards" prefix="my" />}
        value={
          <b>
            {formatBalance(formatUnits(myReward.value, myReward.decimals))} {myReward.symbol}
          </b>
        }
        isLast={true}
        bold={true}
      />
    </div>
  );
};

export default VoterStatistics;
