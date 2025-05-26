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
import RewardsError from "../../../../shared/Error";
import RankingSuffix from "./components/RankingSuffix";
import StatisticsRow from "./components/StatisticsRow";
import StatisticsSkeleton from "./components/StatisticsSkeleton";
import VotesInfo from "./components/VotesInfo";

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
  const {
    statistics,
    isLoading,
    isError,
    refetch: refetchStatistics,
  } = useVoterRewardsStatistics(contestAddress, rewards.contractAddress, ranking, chainId ?? 0);

  const {
    data: totalRewardsForRank,
    isLoading: isTotalRewardsForRankLoading,
    isError: isTotalRewardsForRankError,
    refetch: refetchTotalRewardsForRank,
  } = useTotalRewardsForRank({
    rewardsModuleAddress: rewards.contractAddress as `0x${string}`,
    rewardsModuleAbi: rewards.abi,
    chainId: chainId ?? 0,
    ranking,
  });

  if (isLoading || isTotalRewardsForRankLoading) return <StatisticsSkeleton />;

  if (isError || isTotalRewardsForRankError)
    return <RewardsError onRetry={isError ? refetchStatistics : refetchTotalRewardsForRank} />;

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
    <div className="flex flex-col w-full text-neutral-9 gap-2 mt-4">
      <StatisticsRow
        label={<RankingSuffix ranking={ranking} text="place voter rewards" />}
        value={renderTotalRewards()}
      />

      <VotesInfo ranking={ranking} info={statistics} />

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
