import { FC } from "react";
import ContestWithdrawRewards from "../../../components/WithdrawRewards";
import { Abi } from "viem";
import { useCancelRewards } from "@hooks/useCancelRewards";
import MotionSpinner from "@components/UI/MotionSpinner";
import RewardsCanceledDescription from "./components/Description";

interface RewardsCanceledProps {
  isCreatorView: boolean;
  rewardsModuleAddress: string;
  rewardsAbi: Abi;
  rankings: number[];
  chainId: number;
  version: string;
}

const RewardsCanceled: FC<RewardsCanceledProps> = ({
  isCreatorView,
  rewardsModuleAddress,
  rewardsAbi,
  rankings,
  chainId,
  version,
}) => {
  const { isCanceledByJkLabs, isCanceledByJkLabsLoading, isCanceledByJkLabsError, refetchCanceledByJkLabs } =
    useCancelRewards({
      rewardsAddress: rewardsModuleAddress as `0x${string}`,
      abi: rewardsAbi,
      chainId,
      version,
    });

  if (isCanceledByJkLabsLoading) {
    return (
      <div className="flex flex-col gap-10">
        <div className="flex flex-col gap-2 items-start">
          <p className="text-[24px] text-negative-11">rewards have been canceled</p>
          <p className="loadingDots font-sabo text-[14px] text-neutral-14 mt-4">loading cancellation details</p>
        </div>
      </div>
    );
  }

  if (isCanceledByJkLabsError) {
    return (
      <div className="flex flex-col gap-10">
        <div className="flex flex-col gap-2 items-start">
          <p className="text-[24px] text-negative-11">rewards have been canceled</p>
          <p className="text-[16px] text-neutral-9 font-bold">
            ruh-roh! there was an error loading the cancellation details,
            <button className="underline" onClick={() => refetchCanceledByJkLabs()}>
              try again!
            </button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-2 items-start">
        <p className="text-[24px] text-negative-11">rewards have been canceled</p>
        {isCreatorView && (
          <ContestWithdrawRewards
            rewardsModuleAddress={rewardsModuleAddress}
            rewardsAbi={rewardsAbi}
            rankings={rankings}
            chainId={chainId}
            isCanceledByJkLabs={isCanceledByJkLabs}
          />
        )}
      </div>
      <RewardsCanceledDescription isCanceledByJkLabs={isCanceledByJkLabs} isCreatorView={isCreatorView} />
    </div>
  );
};

export default RewardsCanceled;
