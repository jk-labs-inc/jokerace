import { TokenInfo, useReleasableRewards } from "@hooks/useReleasableRewards";
import { FC, useMemo, useState } from "react";
import { Tooltip } from "react-tooltip";
import { Abi } from "viem";
import WithdrawRewardsModal from "./components/Modal";

interface ContestWithdrawRewardsProps {
  rewardsModuleAddress: string;
  rewardsAbi: Abi;
  chainId: number;
  rankings: number[];
  isCanceledByJkLabs: boolean;
}

const tooltipId = "withdraw-rewards-canceled-tooltip";

const ContestWithdrawRewards: FC<ContestWithdrawRewardsProps> = ({
  rewardsModuleAddress,
  rewardsAbi,
  chainId,
  rankings,
  isCanceledByJkLabs,
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
        <div className="inline-block">
          <button
            className={`text-[16px] font-bold ${
              isCanceledByJkLabs ? "text-positive-11 cursor-not-allowed opacity-50" : "text-positive-11 cursor-pointer"
            }`}
            onClick={isCanceledByJkLabs ? undefined : () => setIsWithdrawRewardsModalOpen(true)}
            disabled={isCanceledByJkLabs}
            data-tooltip-id={isCanceledByJkLabs ? tooltipId : undefined}
            data-tooltip-place="top"
          >
            📤 withdraw funds
          </button>
          {isCanceledByJkLabs && (
            <Tooltip
              id={tooltipId}
              className="max-w-64 p-2 opacity-100! z-50! border border-transparent rounded-lg focus:outline-none"
            >
              <div className="text-[12px] text-white">
                this rewards module has been canceled by jk labs at least a week after the underlying contest has ended and only they can withdraw the remaining funds in it to resolve any issues.
              </div>
            </Tooltip>
          )}
        </div>
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
