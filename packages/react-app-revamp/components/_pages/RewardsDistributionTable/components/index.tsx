import { returnOnlySuffix } from "@helpers/ordinalSuffix";
import { useDistributeRewardStore } from "@hooks/useDistributeRewards";
import useFundRewardsModule from "@hooks/useFundRewards";
import { useWithdrawRewardStore } from "@hooks/useWithdrawRewards";
import { FC } from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { Abi } from "viem";
import { useReadContract } from "wagmi";
import { PayeeReward } from "./PayeeReward";

export const ZERO_BALANCE = "0x0000000000000000000000000000000000000000000000000000000000000000";

export type ERC20Token = {
  contractAddress: string;
  tokenBalance: string;
  tokenSymbol: string;
  decimals: number;
};

interface RewardsDistributionTableProps {
  payee: number;
  tokens: Array<ERC20Token>;
  contractRewardsModuleAddress: string;
  abiRewardsModule: Abi;
  chainId: number;
}

const RewardsDistributionTable: FC<RewardsDistributionTableProps> = ({ ...props }) => {
  const { payee, tokens, contractRewardsModuleAddress, abiRewardsModule, chainId } = props;
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
    args: [Number(payee)],
    query: {
      select(data) {
        return Number(data);
      },
    },
  });

  const isLoading = isSharesLoading || isFundingRewardsLoading || isWithdrawRewardsLoading;

  return (
    <SkeletonTheme baseColor="#706f78" highlightColor="#FFE25B" duration={1}>
      {isError && "Something went wrong, please reload the page."}

      {share && (
        <div className="flex flex-col gap-12 max-w-[500px]">
          <div className="flex flex-col gap-3">
            <p className="text-[16px] font-bold text-neutral-11">
              {payee}
              <sup>{returnOnlySuffix(payee)}</sup> <span className="ml-1">place</span>
            </p>
            <ul className="flex flex-col gap-3 pl-4 text-[16px] font-bold list-explainer">
              {tokens?.length > 0 &&
                tokens.map((token: any, index: number) => (
                  <div key={index}>
                    {isLoading || isDistributeRewardsLoading ? (
                      <li>
                        <Skeleton width={200} height={16} />
                      </li>
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
                  </div>
                ))}
            </ul>
          </div>
        </div>
      )}
    </SkeletonTheme>
  );
};

export default RewardsDistributionTable;
