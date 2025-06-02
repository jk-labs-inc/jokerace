import { TokenInfo, useReleasableRewards } from "@hooks/useReleasableRewards";
import { FC, useMemo, useState } from "react";
import { Abi } from "viem";
import WithdrawRewardsModal from "./components/Modal";

interface ContestWithdrawRewardsProps {
  rewardsModuleAddress: string;
  rewardsAbi: Abi;
  chainId: number;
  rankings: number[];
}

const ContestWithdrawRewards: FC<ContestWithdrawRewardsProps> = ({
  rewardsModuleAddress,
  rewardsAbi,
  chainId,
  rankings,
}) => {
  const [isWithdrawRewardsModalOpen, setIsWithdrawRewardsModalOpen] = useState(false);
  const { data: releasableRewards, isLoading: isReleasableRewardsLoading } = useReleasableRewards({
    contractAddress: rewardsModuleAddress,
    chainId: chainId,
    abi: rewardsAbi,
    rankings: rankings,
  });

  const aggregatedRewards = useMemo(() => {
    const rewardMap = new Map<string, TokenInfo>();

    releasableRewards?.forEach(reward => {
      reward.tokens.forEach(token => {
        const existingToken = rewardMap.get(token.address);
        if (existingToken) {
          existingToken.amount = (existingToken.amount || 0n) + (token.amount || 0n);
        } else {
          rewardMap.set(token.address, { ...token });
        }
      });
    });

    return Array.from(rewardMap.values()).filter(token => token.amount && token.amount > 0n);
  }, [releasableRewards]);

  return (
    <>
      {aggregatedRewards.length > 0 ? (
        <button className="text-positive-11 text-[16px] font-bold" onClick={() => setIsWithdrawRewardsModalOpen(true)}>
          📤 withdraw funds
        </button>
      ) : (
        <p className="text-neutral-11 text-[16px] font-bold">you have withdrawn funds</p>
      )}
      <WithdrawRewardsModal
        aggregatedRewards={aggregatedRewards}
        rewardsModuleAddress={rewardsModuleAddress}
        rewardsAbi={rewardsAbi}
        rankings={rankings}
        isReleasableRewardsLoading={isReleasableRewardsLoading}
        isWithdrawRewardsModalOpen={isWithdrawRewardsModalOpen}
        setIsWithdrawRewardsModalOpen={setIsWithdrawRewardsModalOpen}
      />
    </>
  );
};

export default ContestWithdrawRewards;
