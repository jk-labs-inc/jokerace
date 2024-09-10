import DialogWithdrawFundsFromRewardsModule from "@components/_pages/DialogWithdrawFundsFromRewardsModule";
import ContestWithdrawRewards from "@components/_pages/Rewards/components/Withdraw";
import RewardsDistributionTable from "@components/_pages/RewardsDistributionTable/components";
import { useReleasableRewards } from "@hooks/useReleasableRewards";
import { FC } from "react";
import { Abi } from "viem";

interface RewardsReleasableProps {
  rewardsModuleAddress: string;
  chainId: number;
  rewardsAbi: Abi;
  rankings: number[];
  isWithdrawRewardsOpen: boolean;
  setIsWithdrawRewardsOpen: (isOpen: boolean) => void;
}

const RewardsReleasable: FC<RewardsReleasableProps> = ({
  rewardsModuleAddress,
  chainId,
  rewardsAbi,
  rankings,
  isWithdrawRewardsOpen,
  setIsWithdrawRewardsOpen,
}) => {
  const {
    data: releasableRewards,
    isLoading: isReleasableRewardsLoading,
    isContractError: isReleasableRewardsContractError,
    isErc20AddressesError: isReleasableRewardsErc20AddressesError,
  } = useReleasableRewards({
    contractAddress: rewardsModuleAddress,
    chainId,
    abi: rewardsAbi,
    rankings,
  });

  if (isReleasableRewardsLoading)
    return <p className="loadingDots font-sabo text-[14px] text-neutral-14">loading rewards to distribute</p>;
  if (isReleasableRewardsContractError || !releasableRewards)
    return (
      <p className="text-[16px] text-negative-11 font-bold">
        error while loading rewards to distribute, please reload the page.
      </p>
    );

  return (
    <>
      {isReleasableRewardsErc20AddressesError && (
        <div className="text-[16px] text-negative-11 font-bold">
          Error while loading ERC20 tokens for rewards distribution, please reload the page.
        </div>
      )}
      {rankings.map((payee, index) => (
        <RewardsDistributionTable
          key={index}
          chainId={chainId}
          payee={payee}
          releasableRewards={releasableRewards}
          contractRewardsModuleAddress={rewardsModuleAddress}
          abiRewardsModule={rewardsAbi}
        />
      ))}

      <DialogWithdrawFundsFromRewardsModule isOpen={isWithdrawRewardsOpen} setIsOpen={setIsWithdrawRewardsOpen}>
        <ContestWithdrawRewards
          releasableRewards={releasableRewards}
          rewardsModuleAddress={rewardsModuleAddress}
          rewardsAbi={rewardsAbi}
          isReleasableRewardsLoading={isReleasableRewardsLoading}
        />
      </DialogWithdrawFundsFromRewardsModule>
    </>
  );
};

export default RewardsReleasable;
