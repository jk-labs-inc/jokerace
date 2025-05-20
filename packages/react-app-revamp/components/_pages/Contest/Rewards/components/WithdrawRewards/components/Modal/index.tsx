import ButtonWithdraw from "@components/_pages/DialogWithdrawFundsFromRewardsModule/ButtonWithdraw";
import DialogModalV4 from "@components/UI/DialogModalV4";
import { TokenInfo } from "@hooks/useReleasableRewards";
import { FC } from "react";
import { Abi } from "viem";

interface WithdrawRewardsModalProps {
  aggregatedRewards: TokenInfo[];
  rewardsModuleAddress: string;
  rewardsAbi: Abi;
  rankings: number[];
  isReleasableRewardsLoading: boolean;
  isWithdrawRewardsModalOpen: boolean;
  setIsWithdrawRewardsModalOpen: (isOpen: boolean) => void;
}

const WithdrawRewardsModal: FC<WithdrawRewardsModalProps> = ({
  aggregatedRewards,
  isWithdrawRewardsModalOpen,
  setIsWithdrawRewardsModalOpen,
  rewardsModuleAddress,
  rewardsAbi,
  rankings,
  isReleasableRewardsLoading,
}) => {
  //TODO: think about redesign here
  return (
    <DialogModalV4 isOpen={isWithdrawRewardsModalOpen} onClose={setIsWithdrawRewardsModalOpen}>
      <div className="flex flex-col gap-8 py-6 md:py-16 pl-8 md:pl-32 pr-4 md:pr-16">
        <div className="flex justify-between items-center ml-auto">
          <img
            src="/modal/modal_close.svg"
            width={39}
            height={33}
            alt="close"
            className="hidden md:block cursor-pointer"
            onClick={() => setIsWithdrawRewardsModalOpen(false)}
          />
        </div>
        <div className="w-full md:w-[600px] mt-14">
          {isReleasableRewardsLoading ? (
            <p className="loadingDots font-sabo text-[14px] text-neutral-14">Loading rewards</p>
          ) : (
            <ul className="flex flex-col gap-3 text-[16px] font-bold list-explainer">
              {/* TODO: close modal when user withdraws */}
              {aggregatedRewards.map((token, index) => (
                <ButtonWithdraw
                  key={index}
                  token={token}
                  rewardsModuleAddress={rewardsModuleAddress}
                  rewardsAbi={rewardsAbi}
                />
              ))}
            </ul>
          )}
        </div>
      </div>
    </DialogModalV4>
  );
};

export default WithdrawRewardsModal;
