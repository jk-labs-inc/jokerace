import { useCancelRewards } from "@hooks/useCancelRewards";
import useContestConfigStore from "@hooks/useContestConfig/store";
import useRewardsModule from "@hooks/useRewards";
import { FC } from "react";
import { Abi } from "viem";
import RewardsDisplay from "./components/RewardsDisplay";
import RewardsLoader from "./components/RewardsLoader";
import RewardsMarquee from "./components/RewardsMarquee";
import RewardsSelfFundedMarquee from "./components/RewardsSelfFundedMarquee";

interface ContestRewardsInfoProps {
  version: string;
}

const ContestRewardsInfo: FC<ContestRewardsInfoProps> = ({ version }) => {
  const { contestConfig } = useContestConfigStore(state => state);
  const { data: rewards, isLoading, isSuccess, isError } = useRewardsModule();
  const {
    isCanceled,
    isLoading: isCancelLoading,
    isError: isCancelError,
  } = useCancelRewards({
    rewardsAddress: rewards?.contractAddress as `0x${string}`,
    abi: rewards?.abi as Abi,
    chainId: contestConfig.chainId,
    version,
  });

  if (isLoading || isCancelLoading) {
    return <RewardsLoader />;
  }

  if (isError || !isSuccess || isCanceled || isCancelError) return null;

  if (!rewards) return null;

  return (
    <div className="flex items-center gap-2 md:gap-4">
      <RewardsMarquee moduleType={rewards.moduleType} />
      <RewardsDisplay
        rewardsModuleAddress={rewards.contractAddress as `0x${string}`}
        rewardsAbi={rewards.abi as Abi}
        chainId={contestConfig.chainId}
        rewards={rewards}
        isRewardsModuleLoading={isLoading}
        isRewardsModuleError={isError}
      />
      {rewards.isSelfFunded && <RewardsSelfFundedMarquee />}
    </div>
  );
};

export default ContestRewardsInfo;
