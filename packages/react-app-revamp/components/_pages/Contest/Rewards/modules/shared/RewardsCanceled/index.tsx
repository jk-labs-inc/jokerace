import { FC } from "react";
import ContestWithdrawRewards from "../../../components/WithdrawRewards";
import { Abi } from "viem";

interface RewardsCanceledProps {
  isCreatorView: boolean;
  rewardsModuleAddress: string;
  rewardsAbi: Abi;
  rankings: number[];
  chainId: number;
}

const RewardsCanceled: FC<RewardsCanceledProps> = ({
  isCreatorView,
  rewardsModuleAddress,
  rewardsAbi,
  rankings,
  chainId,
}) => {
  const canceledDescription = () => {
    switch (isCreatorView) {
      case true:
        return (
          <div className="flex flex-col gap-4">
            <p className="text-[16px] text-neutral-11">
              <b>you have canceled rewards for this contest.</b> <br />
              only you have access to funds.
            </p>
            <p className="text-[16px] text-neutral-11">
              please be in touch with players in case you <br />
              need to distribute funds to them manually.
            </p>
          </div>
        );
      case false:
        return (
          <div className="flex flex-col gap-4">
            <p className="text-[16px] text-neutral-11 font-bold">
              the contest creator canceled rewards for this contest.
            </p>
            <p className="text-[16px] text-neutral-11">
              only the contest creator can distribute any funds <br /> from this contest. please reach out to them{" "}
              <br /> directly for any support.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-2 items-start">
        <p className="text-[24px] text-negative-11">rewards have been canceled</p>
        <ContestWithdrawRewards
          rewardsModuleAddress={rewardsModuleAddress}
          rewardsAbi={rewardsAbi}
          rankings={rankings}
          chainId={chainId}
        />
      </div>
      {canceledDescription()}
    </div>
  );
};
export default RewardsCanceled;
