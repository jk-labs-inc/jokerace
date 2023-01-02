import { useRouter } from "next/router";
import Loader from "@components/Loader";
import { useContractRead } from "wagmi";
import PayeeERC20Reward from "./ERC20Reward";
import PayeeNativeReward from "./NativeCurrencyReward";
import { chains } from "@config/wagmi";
import ordinalize from "@helpers/ordinalize";
interface RewardsWinnerProps {
  payee: any;
  erc20Tokens: Array<string>;
  contractRewardsModuleAddress: string;
  abiRewardsModule: any;
  chainId: number;
  totalShares: number;
}

export const RewardsWinner = (props: RewardsWinnerProps) => {
  const { payee, erc20Tokens, contractRewardsModuleAddress, abiRewardsModule, totalShares } = props;
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
            <>
            <h2 className="font-bold text-lg mb-1">{`${ordinalize(payee)}`} place {`${payee}`}: wins {`${((data.toNumber() * 100) / totalShares).toFixed(2)}`}% of all rewards</h2>
            <ul>
              <li>
                <PayeeNativeReward
                  share={data}
                  payee={payee}
                  chainId={
                    chains.filter(chain => chain.name.toLowerCase().replace(" ", "") === asPath.split("/")?.[2])?.[0]
                      ?.id
                  }
                  contractRewardsModuleAddress={contractRewardsModuleAddress}
                  abiRewardsModule={abiRewardsModule}
                />
              </li>
              {erc20Tokens?.length > 0 && (
                <>
                  {erc20Tokens.map((token: any) => (
                    <li key={`payee-rank-${`${payee}`}-reward-token-${token.contractAddress}`}>
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
            </>
          )}
        </>
      )}
    </>
  );
};

export default RewardsWinner;
