import { useTotalRewards } from "@hooks/useTotalRewards";
import { formatBalance } from "@helpers/formatBalance";
import { FC } from "react";
import { formatUnits } from "viem";
import Skeleton from "react-loading-skeleton";
import RewardsError from "@components/_pages/Contest/Rewards/modules/shared/Error";
import { RewardModuleInfo } from "lib/rewards/types";

interface RewardsParametersTokensProps {
  rewardsStore: RewardModuleInfo;
  chainId: number;
}

const formatReward = (value: bigint, decimals: number, symbol: string) => (
  <>
    {formatBalance(formatUnits(value, decimals))} {symbol}
  </>
);

const RewardsParametersTokens: FC<RewardsParametersTokensProps> = ({ rewardsStore, chainId }) => {
  const {
    data: totalRewards,
    isLoading,
    isError,
    refetch,
  } = useTotalRewards({
    rewardsModuleAddress: rewardsStore.contractAddress as `0x${string}`,
    rewardsModuleAbi: rewardsStore.abi,
    chainId,
  });

  if (isLoading) {
    return (
      <li className="list-disc">
        <Skeleton width={300} height={16} baseColor="#6A6A6A" highlightColor="#BB65FF" duration={1} />
      </li>
    );
  }

  if (isError) {
    return <RewardsError onRetry={refetch} />;
  }

  if (totalRewards && !totalRewards.native.value && Object.keys(totalRewards.tokens).length === 0) {
    return null;
  }

  const renderRewardsList = () => {
    if (!totalRewards) return null;

    const allRewards = [
      {
        key: "native",
        content: formatReward(totalRewards.native.value, totalRewards.native.decimals, totalRewards.native.symbol),
      },
      ...Object.entries(totalRewards.tokens).map(([address, token]) => ({
        key: address,
        content: formatReward(token.value, token.decimals, token.symbol),
      })),
    ];

    return allRewards.map((reward, index) => (
      <span key={reward.key}>
        {reward.content}
        {index < allRewards.length - 1 && ", "}
      </span>
    ));
  };

  return <li className="list-disc">rewards pool has {renderRewardsList()}</li>;
};

export default RewardsParametersTokens;
