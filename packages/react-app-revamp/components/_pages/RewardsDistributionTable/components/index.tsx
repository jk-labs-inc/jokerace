import Loader from "@components/UI/Loader";
import { ordinalSuffix } from "@helpers/ordinalSuffix";
import useFundRewardsModule from "@hooks/useFundRewards";
import { useFundRewardsStore } from "@hooks/useFundRewards/store";
import { FC } from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { useBalance, useContractRead } from "wagmi";
import PayeeERC20Reward from "./ERC20Reward";
import { PayeeNativeReward } from "./NativeReward";

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

  const { data: nativeTokenBalance } = useBalance({
    addressOrName: contractRewardsModuleAddress,
    chainId: props.chainId,
  });

  return (
    <SkeletonTheme baseColor="#706f78" highlightColor="#FFE25B" duration={1}>
      {isError && "Something went wrong, please reload the page."}
      {data && (
        <div className="flex flex-col gap-12 w-[250px]">
          <div className="flex flex-col gap-3">
            <p className="text-[16px] font-bold text-neutral-11">{ordinalSuffix(parseFloat(payee))} place:</p>
            <ul className="flex flex-col gap-3 pl-4 text-[16px] font-bold list-explainer">
              {nativeTokenBalance?.value.gt(0) ? (
                <li className="flex items-center">
                  {isLoading || isFundingRewardsLoading ? (
                    <Skeleton width={200} height={16} />
                  ) : (
                    <PayeeNativeReward
                      share={data}
                      payee={payee}
                      chainId={chainId}
                      contractRewardsModuleAddress={contractRewardsModuleAddress}
                      abiRewardsModule={abiRewardsModule}
                    />
                  )}
                </li>
              ) : isFundingRewardsLoading ? (
                <li>
                  {isFundingRewardsLoading ? (
                    <Skeleton width={200} height={16} />
                  ) : (
                    <PayeeNativeReward
                      share={data}
                      payee={payee}
                      chainId={chainId}
                      contractRewardsModuleAddress={contractRewardsModuleAddress}
                      abiRewardsModule={abiRewardsModule}
                    />
                  )}
                </li>
              ) : (
                <li>no funds to distribute</li>
              )}

              {erc20Tokens?.length > 0 && (
                <>
                  {erc20Tokens.map((token: any, index: number) => (
                    <li className="flex items-center" key={index}>
                      {isLoading || isFundingRewardsLoading ? (
                        <Skeleton width={200} height={16} />
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
                    </li>
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
