import ButtonV3 from "@components/UI/ButtonV3";
import Loader from "@components/UI/Loader";
import { chains } from "@config/wagmi";
import { ordinalSuffix } from "@helpers/ordinalSuffix";
import { useRouter } from "next/router";
import { FC } from "react";
import { useContractRead } from "wagmi";
import PayeeERC20Reward from "./ERC20Reward";
import { PayeeNativeReward } from "./NativeReward";

type ERC20Token = {
  contractAddress: string;
  tokenBalance: string;
};

interface RewardsDistributionTableProps {
  payee: any;
  erc20Tokens: Array<ERC20Token>;
  contractRewardsModuleAddress: string;
  abiRewardsModule: any;
  chainId: number;
}

const ZERO_BALANCE = "0x0000000000000000000000000000000000000000000000000000000000000000";

const RewardsDistributionTable: FC<RewardsDistributionTableProps> = ({ ...props }) => {
  const { payee, erc20Tokens, contractRewardsModuleAddress, abiRewardsModule } = props;
  const { asPath } = useRouter();
  const { data, isError, isLoading } = useContractRead({
    addressOrName: contractRewardsModuleAddress,
    contractInterface: abiRewardsModule,
    chainId: chains.filter(chain => chain.name.toLowerCase().replace(" ", "") === asPath.split("/")?.[2])?.[0]?.id,
    functionName: "shares",
    args: payee,
  });

  return (
    <>
      {isLoading && !data ? (
        <Loader scale="component">Loading rewards data for rank {`${payee}`}...</Loader>
      ) : (
        <>
          {isError && "Something went wrong, please reload the page."}
          {data && (
            <div className="flex flex-col gap-12 w-[250px]">
              <div className="flex flex-col gap-3">
                <p className="text-[16px] font-bold text-neutral-11">{ordinalSuffix(parseFloat(payee))} place:</p>
                <ul className="pl-4 text-[16px] font-bold">
                  <li className="list-disc">
                    <PayeeNativeReward
                      share={data}
                      payee={payee}
                      chainId={
                        chains.filter(
                          chain => chain.name.toLowerCase().replace(" ", "") === asPath.split("/")?.[2],
                        )?.[0]?.id
                      }
                      contractRewardsModuleAddress={contractRewardsModuleAddress}
                      abiRewardsModule={abiRewardsModule}
                    />
                  </li>

                  {erc20Tokens?.length > 0 && (
                    <>
                      {erc20Tokens
                        .filter(token => token.tokenBalance !== ZERO_BALANCE)
                        .map((token: any, index: number) => (
                          <li className="list-disc" key={index}>
                            <PayeeERC20Reward
                              share={data}
                              payee={payee}
                              chainId={
                                chains.filter(
                                  chain => chain.name.toLowerCase().replace(" ", "") === asPath.split("/")?.[2],
                                )?.[0]?.id
                              }
                              tokenAddress={token.contractAddress}
                              contractRewardsModuleAddress={contractRewardsModuleAddress}
                              abiRewardsModule={abiRewardsModule}
                            />
                          </li>
                        ))}
                    </>
                  )}
                </ul>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default RewardsDistributionTable;
