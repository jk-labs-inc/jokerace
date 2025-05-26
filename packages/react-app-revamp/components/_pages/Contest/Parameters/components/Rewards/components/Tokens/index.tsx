import { RewardModuleInfo } from "@hooks/useRewards/store";
import { useTotalRewards } from "@hooks/useTotalRewards";
import { formatBalance } from "@helpers/formatBalance";
import { FC } from "react";
import { formatUnits } from "viem";
import Skeleton from "react-loading-skeleton";

interface RewardsParametersTokensProps {
  rewardsStore: RewardModuleInfo;
  chainId: number;
}

const RewardsParametersTokens: FC<RewardsParametersTokensProps> = ({ rewardsStore, chainId }) => {
  const { data: totalRewards, isLoading } = useTotalRewards({
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

  if (totalRewards && !totalRewards.native.value && Object.keys(totalRewards.tokens).length === 0) {
    return null;
  }

  const formatReward = (value: bigint, decimals: number, symbol: string) => (
    <>
      {formatBalance(formatUnits(value, decimals))} $<span className="uppercase">{symbol}</span>
    </>
  );

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
