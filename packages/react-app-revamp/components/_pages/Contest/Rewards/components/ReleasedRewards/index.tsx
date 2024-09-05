import RewardsPreviouslyDistributedTable from "@components/_pages/RewardsPreviouslyDistributedTable";
import { useReleasedRewards } from "@hooks/useReleasedRewards";
import { FC } from "react";
import { Abi } from "viem";

interface RewardsReleasedProps {
  rewardsModuleAddress: string;
  chainId: number;
  rewardsAbi: Abi;
  rankings: number[];
}

const RewardsReleased: FC<RewardsReleasedProps> = ({ rewardsModuleAddress, chainId, rewardsAbi, rankings }) => {
  const {
    data: releasedRewards,
    isLoading: isReleasedRewardsLoading,
    isError: isReleasedRewardsError,
  } = useReleasedRewards({
    contractAddress: rewardsModuleAddress,
    chainId,
    abi: rewardsAbi,
    rankings,
  });

  if (isReleasedRewardsLoading)
    return <p className="loadingDots font-sabo text-[14px] text-neutral-14">loading previously distributed rewards</p>;
  if (isReleasedRewardsError || !releasedRewards)
    return (
      <p className="text-[16px] text-negative-11 font-bold">
        error while loading previously distributed rewards, please try again
      </p>
    );

  return (
    <>
      {rankings.map((payee, index) => (
        <RewardsPreviouslyDistributedTable
          key={index}
          chainId={chainId}
          payee={payee}
          releasedRewards={releasedRewards}
          contractRewardsModuleAddress={rewardsModuleAddress}
          abiRewardsModule={rewardsAbi}
        />
      ))}
    </>
  );
};

export default RewardsReleased;
