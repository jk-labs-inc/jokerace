import { ordinalSuffix } from "@helpers/ordinalSuffix";
import useFundRewardsModule from "@hooks/useFundRewards";
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
}

const RewardsDistributionTable: FC<RewardsDistributionTableProps> = ({ ...props }) => {
  const { payee, erc20Tokens, contractRewardsModuleAddress, abiRewardsModule, chainId } = props;
  const { isLoading: isFundingRewardsLoading } = useFundRewardsModule();
  const { data, isError, isLoading } = useContractRead({
    addressOrName: contractRewardsModuleAddress,
    contractInterface: abiRewardsModule,
    chainId: chainId,
    functionName: "shares",
    args: payee,
  });

  return (
    <SkeletonTheme baseColor="#706f78" highlightColor="#FFE25B" duration={1}>
      {isError && "Something went wrong, please reload the page."}
      {data && (
        <div className="flex flex-col gap-12 w-[250px]">
          <div className="flex flex-col gap-3">
            <p className="text-[16px] font-bold text-neutral-11">{ordinalSuffix(parseFloat(payee))} place:</p>
            <ul className="flex flex-col gap-3 pl-4 text-[16px] font-bold list-explainer">
              {isLoading || isFundingRewardsLoading ? (
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
                  {erc20Tokens
                    .filter(token => token.tokenBalance !== ZERO_BALANCE)
                    .map((token: any, index: number) => (
                      <>
                        {isLoading || isFundingRewardsLoading ? (
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
    </SkeletonTheme>
  );
};

export default RewardsDistributionTable;
