import RewardsPreviouslyDistributedTable from "@components/_pages/RewardsPreviouslyDistributedTable";
import { useReleasedRewards } from "@hooks/useReleasedRewards";
import { FC } from "react";
import { Abi } from "viem";
import TotalRewardsInfo from "../TotalRewardsInfo";

interface RewardsReleasedProps {
  rewardsModuleAddress: string;
  chainId: number;
  rewardsAbi: Abi;
  rankings: number[];
}

const RewardsReleased: FC<RewardsReleasedProps> = ({ rewardsModuleAddress, chainId, rewardsAbi, rankings }) => {
  const {
    data: releasedRewards,
    totalRewards,
    isLoading: isReleasedRewardsLoading,
    isContractError: isReleasedRewardsContractError,
    isErc20AddressesError: isReleasedRewardsErc20AddressesError,
  } = useReleasedRewards({
    contractAddress: rewardsModuleAddress,
    chainId,
    abi: rewardsAbi,
    rankings,
  });

  if (isReleasedRewardsLoading)
    return <p className="loadingDots font-sabo text-[14px] text-neutral-14">loading previously distributed rewards</p>;
  if (isReleasedRewardsContractError || !releasedRewards)
    return (
      <p className="text-[16px] text-negative-11 font-bold">
        error while loading previously distributed rewards, please reload the page.
      </p>
    );

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
        <p className="text-[24px] text-neutral-9 font-bold">previously distributed rewards</p>
        {totalRewards.length > 0 ? <TotalRewardsInfo totalRewards={totalRewards} /> : null}
      </div>
      {isReleasedRewardsErc20AddressesError && (
        <div className="text-[16px] text-negative-11 font-bold">
          Error while loading ERC20 tokens for previously distributed rewards, please reload the page.
        </div>
      )}

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
    </div>
  );
};

export default RewardsReleased;
