import { returnOnlySuffix } from "@helpers/ordinalSuffix";
import { useDistributeRewardStore } from "@hooks/useDistributeRewards";
import useFundRewardsModule from "@hooks/useFundRewards";
import { useWithdrawRewardStore } from "@hooks/useWithdrawRewards";
import { FC } from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { Abi } from "viem";
import { useReadContract } from "wagmi";
import { PayeeReward } from "./PayeeReward";
import { ProcessedReleasableRewards, TokenInfo } from "@hooks/useReleasableRewards";

export const ZERO_BALANCE = "0x0000000000000000000000000000000000000000000000000000000000000000";

export type ERC20Token = {
  contractAddress: string;
  tokenBalance: string;
  tokenSymbol: string;
  decimals: number;
};

interface RewardsDistributionTableProps {
  payee: number;
  releasableRewards: ProcessedReleasableRewards[];
  contractRewardsModuleAddress: string;
  abiRewardsModule: Abi;
  chainId: number;
}

const RewardsDistributionTable: FC<RewardsDistributionTableProps> = ({ ...props }) => {
  const { payee, releasableRewards, contractRewardsModuleAddress, abiRewardsModule, chainId } = props;
  const { isLoading: isFundingRewardsLoading } = useFundRewardsModule();
  const { isLoading: isDistributeRewardsLoading } = useDistributeRewardStore(state => state);
  const { isLoading: isWithdrawRewardsLoading } = useWithdrawRewardStore(state => state);
  const {
    data: share,
    isError,
    isLoading: isSharesLoading,
  } = useReadContract({
    address: contractRewardsModuleAddress as `0x${string}`,
    abi: abiRewardsModule,
    chainId: chainId,
    functionName: "shares",
    args: [payee],
    query: {
      select(data) {
        return Number(data);
      },
    },
  });
  const payeeRewardInfo = releasableRewards.find(reward => reward.ranking === payee);

  const isLoading = isSharesLoading || isFundingRewardsLoading || isWithdrawRewardsLoading;

  return (
    <SkeletonTheme baseColor="#706f78" highlightColor="#FFE25B" duration={1}>
      {isError && "Something went wrong, please reload the page."}

      {share && (
        <div className="flex flex-col gap-8 max-w-[500px]">
          <div className="flex flex-col gap-3">
            <p className="text-[16px] font-bold text-neutral-11">
              {payee}
              <sup>{returnOnlySuffix(payee)}</sup> <span className="ml-1">place</span>
            </p>
            <ul
              className={`flex flex-col gap-3 pl-4 text-[16px] font-bold ${payeeRewardInfo ? "list-white-dot" : "list-gray-dot"}`}
            >
              {payeeRewardInfo ? (
                payeeRewardInfo.tokens.map((token: TokenInfo, tokenIndex: number) => (
                  <li key={`${payeeRewardInfo.ranking}-${tokenIndex}`} className="flex items-center">
                    {isLoading || isDistributeRewardsLoading ? (
                      <Skeleton width={200} height={16} />
                    ) : (
                      <PayeeReward
                        share={share}
                        payee={payee}
                        chainId={chainId}
                        token={token}
                        contractRewardsModuleAddress={contractRewardsModuleAddress}
                        abiRewardsModule={abiRewardsModule}
                      />
                    )}
                  </li>
                ))
              ) : (
                <li className="flex items-center">
                  <p className="text-neutral-9 font-bold">No funds to distribute</p>
                </li>
              )}
            </ul>
          </div>
        </div>
      )}
    </SkeletonTheme>
  );
};

export default RewardsDistributionTable;
