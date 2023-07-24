import { ordinalSuffix } from "@helpers/ordinalSuffix";
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
  const { isLoading: isWithdrawRewardsLoading } = useWithdrawRewardStore(state => state);
  const {
    data,
    isError,
    isLoading: isSharesLoading,
  } = useContractRead({
    addressOrName: contractRewardsModuleAddress,
    contractInterface: abiRewardsModule,
    chainId: chainId,
    functionName: "shares",
    args: payee,
  });
  const isLoading = isSharesLoading || isFundingRewardsLoading || isWithdrawRewardsLoading;

  return (
    <SkeletonTheme baseColor="#706f78" highlightColor="#FFE25B" duration={1}>
      {isError && "Something went wrong, please reload the page."}
      {data && !showPreviouslyDistributedTable && (
        <div className="flex flex-col gap-12 w-[300px]">
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

              {erc20Tokens?.length > 0 && (
                <>
                  {erc20Tokens.map((token: any, index: number) => (
                    <>
                      {isLoading ? (
                        <li>
                          <Skeleton width={200} height={16} key={index} />
                        </li>
                      ) : (
                        <PayeeERC20Reward
                          key={index}
                          share={data}
                          payee={payee}
                          chainId={chainId}
                          tokenAddress={token.contractAddress}
                          contractRewardsModuleAddress={contractRewardsModuleAddress}
                          abiRewardsModule={abiRewardsModule}
                        />
                      )}
                    </>
                  ))}
                </>
              )}
            </ul>
          </div>
        </div>
      )}

      {data && showPreviouslyDistributedTable && (
        <div className="flex flex-col gap-12 w-[300px]">
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
                  showPreviouslyDistributed
                />
              )}

              {erc20Tokens?.length > 0 && (
                <>
                  {erc20Tokens.map((token: any, index: number) => (
                    <>
                      {isLoading ? (
                        <li>
                          <Skeleton width={200} height={16} key={index} />
                        </li>
                      ) : (
                        <PayeeERC20Reward
                          key={index}
                          share={data}
                          payee={payee}
                          chainId={chainId}
                          tokenAddress={token.contractAddress}
                          contractRewardsModuleAddress={contractRewardsModuleAddress}
                          abiRewardsModule={abiRewardsModule}
                          showPreviouslyDistributed={showPreviouslyDistributedTable}
                        />
                      )}
                    </>
                  ))}
                </>
              )}
            </ul>
          </div>
        </div>
      )}
    </SkeletonTheme>
  );
};

export default RewardsDistributionTable;
