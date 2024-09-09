import ButtonWithdraw from "@components/_pages/DialogWithdrawFundsFromRewardsModule/ButtonWithdraw";
import { ProcessedReleasableRewards, TokenInfo } from "@hooks/useReleasableRewards";
import { RewardModuleInfo } from "@hooks/useRewards/store";
import { FC, useMemo } from "react";
import { Abi } from "viem";

interface ContestWithdrawRewardsProps {
  releasableRewards: ProcessedReleasableRewards[];
  rewardsModuleAddress: string;
  rewardsAbi: Abi;
  isReleasableRewardsLoading: boolean;
}

const ContestWithdrawRewards: FC<ContestWithdrawRewardsProps> = ({
  releasableRewards,
  rewardsModuleAddress,
  rewardsAbi,
  isReleasableRewardsLoading,
}) => {
  const aggregatedRewards = useMemo(() => {
    const rewardMap = new Map<string, TokenInfo>();

    releasableRewards.forEach(reward => {
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
    <div className="w-full md:w-[600px] mt-14">
      {isReleasableRewardsLoading ? (
        <p className="loadingDots font-sabo text-[14px] text-neutral-14">Loading rewards</p>
      ) : aggregatedRewards.length > 0 ? (
        <ul className="flex flex-col gap-3 text-[16px] font-bold list-explainer">
          {aggregatedRewards.map((token, index) => (
            <ButtonWithdraw
              key={index}
              token={token}
              rewardsModuleAddress={rewardsModuleAddress}
              rewardsAbi={rewardsAbi}
            />
          ))}
        </ul>
      ) : (
        <p className="italic text-[16px] text-neutral-11">No balance found for rewards.</p>
      )}
    </div>
  );
};

export default ContestWithdrawRewards;
