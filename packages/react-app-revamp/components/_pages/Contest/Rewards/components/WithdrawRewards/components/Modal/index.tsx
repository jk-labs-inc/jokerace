import ButtonWithdraw from "@components/_pages/DialogWithdrawFundsFromRewardsModule/ButtonWithdraw";
import DialogModalV4 from "@components/UI/DialogModalV4";
import { TokenInfo } from "@hooks/useReleasableRewards";
import { FC, useState, useCallback } from "react";
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
  const [withdrawnTokens, setWithdrawnTokens] = useState<Set<string>>(new Set());

  const handleWithdrawSuccess = useCallback((tokenAddress: string) => {
    setWithdrawnTokens(prev => new Set(prev).add(tokenAddress));
  }, []);

  const availableTokens = aggregatedRewards.filter(token => !withdrawnTokens.has(token.address));

  return (
    <DialogModalV4 isOpen={isWithdrawRewardsModalOpen} onClose={setIsWithdrawRewardsModalOpen} width="w-[600px]">
      <div className="flex flex-col gap-8 py-6 pl-8 pr-4">
        <div className="flex justify-between items-center">
          <p className="text-[24px] font-bold">withdraw rewards</p>
          <img
            src="/modal/modal_close.svg"
            width={25}
            height={24}
            alt="close"
            className="hidden md:block cursor-pointer ml-auto"
            onClick={() => setIsWithdrawRewardsModalOpen(false)}
          />
        </div>
        <div className="w-full">
          {isReleasableRewardsLoading ? (
            <p className="loadingDots font-sabo text-[14px] text-neutral-14">Loading rewards</p>
          ) : availableTokens.length === 0 ? (
            <p className="text-[16px] text-neutral-11 font-bold">you have withdrawn funds</p>
          ) : (
            <ul className="flex flex-col gap-3 text-[16px] font-bold list-explainer">
              {availableTokens.map((token, index) => (
                <ButtonWithdraw
                  key={index}
                  token={token}
                  rewardsModuleAddress={rewardsModuleAddress}
                  rewardsAbi={rewardsAbi}
                  onWithdrawSuccess={handleWithdrawSuccess}
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
