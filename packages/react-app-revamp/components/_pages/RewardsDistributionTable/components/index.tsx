import { ordinalSuffix } from "@helpers/ordinalSuffix";
import { useDistributeRewardStore } from "@hooks/useDistributeRewards";
import useFundRewardsModule from "@hooks/useFundRewards";
import { useWithdrawRewardStore } from "@hooks/useWithdrawRewards";
import { FC } from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { useContractRead } from "wagmi";
import PayeeERC20Reward from "./ERC20Reward";
import { PayeeNativeReward } from "./NativeReward";

export const ZERO_BALANCE = "0x0000000000000000000000000000000000000000000000000000000000000000";

type ERC20Token = {
  contractAddress: string;
  tokenBalance: string;
  decimals: number;
};

interface RewardsDistributionTableProps {
  payee: any;
  erc20Tokens: Array<ERC20Token>;
  contractRewardsModuleAddress: string;
  abiRewardsModule: any;
  chainId: number;
  showPreviouslyDistributedTable?: boolean;
}

const RewardsDistributionTable: FC<RewardsDistributionTableProps> = ({ ...props }) => {
  const {
    payee,
    erc20Tokens,
    contractRewardsModuleAddress,
    abiRewardsModule,
    chainId,
    showPreviouslyDistributedTable,
  } = props;
  const { isLoading: isFundingRewardsLoading } = useFundRewardsModule();
  const { isLoading: isDistributeRewardsLoading } = useDistributeRewardStore(state => state);
  const { isLoading: isWithdrawRewardsLoading } = useWithdrawRewardStore(state => state);
  const {
    data,
    isError,
    isLoading: isSharesLoading,
  } = useContractRead({
    address: contractRewardsModuleAddress as `0x${string}`,
    abi: abiRewardsModule,
    chainId: chainId,
    functionName: "shares",
    args: [Number(payee)],
  });
  const isLoading = isSharesLoading || isFundingRewardsLoading || isWithdrawRewardsLoading;

  return (
    <SkeletonTheme baseColor="#706f78" highlightColor="#FFE25B" duration={1}>
      {isError && "Something went wrong, please reload the page."}
      {data && !showPreviouslyDistributedTable && (
        <div className="flex flex-col gap-12 max-w-[500px]">
          <div className="flex flex-col gap-3">
            <p className="text-[16px] font-bold text-neutral-11">{ordinalSuffix(parseFloat(payee))} place:</p>
            <ul className="flex flex-col gap-3 pl-4 text-[16px] font-bold list-explainer">
              {isLoading ? (
                <li>
                  <Skeleton width={200} height={16} />
                </li>
              ) : (
                <PayeeNativeReward
                  share={data}
                  payee={payee}
                  chainId={chainId}
                  contractRewardsModuleAddress={contractRewardsModuleAddress}
                  abiRewardsModule={abiRewardsModule}
                />
              )}

              {erc20Tokens?.length > 0 &&
                erc20Tokens.map((token: any, index: number) => (
                  <div key={index}>
                    {isLoading ? (
                      <li>
                        <Skeleton width={200} height={16} />
                      </li>
                    ) : (
                      <PayeeERC20Reward
                        share={data}
                        payee={payee}
                        chainId={chainId}
                        tokenAddress={token.contractAddress}
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

      {data && showPreviouslyDistributedTable && (
        <div className="flex flex-col gap-12 max-w-[500px]">
          <div className="flex flex-col gap-3">
            <p className="text-[16px] font-bold text-neutral-11">{ordinalSuffix(parseFloat(payee))} place:</p>
            <ul className="flex flex-col gap-3 pl-4 text-[16px] font-bold list-explainer">
              {isLoading || isDistributeRewardsLoading ? (
                <li>
                  <Skeleton width={200} height={16} />
                </li>
              ) : (
                <PayeeNativeReward
                  share={data}
                  payee={payee}
                  chainId={chainId}
                  contractRewardsModuleAddress={contractRewardsModuleAddress}
                  abiRewardsModule={abiRewardsModule}
                  showPreviouslyDistributed
                />
              )}

              {erc20Tokens?.length > 0 &&
                erc20Tokens.map((token: any, index: number) => (
                  <div key={index}>
                    {isLoading || isDistributeRewardsLoading ? (
                      <li>
                        <Skeleton width={200} height={16} />
                      </li>
                    ) : (
                      <PayeeERC20Reward
                        share={data}
                        payee={payee}
                        chainId={chainId}
                        tokenAddress={token.contractAddress}
                        contractRewardsModuleAddress={contractRewardsModuleAddress}
                        abiRewardsModule={abiRewardsModule}
                        showPreviouslyDistributed={showPreviouslyDistributedTable}
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
