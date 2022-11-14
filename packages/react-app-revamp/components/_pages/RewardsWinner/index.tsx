import { useRouter } from "next/router";
import Loader from "@components/Loader";
import { useContractRead } from "wagmi";
import PayeeERC20Reward from "./ERC20Reward";
import PayeeNativeReward from "./NativeCurrencyReward";
import { chains } from "@config/wagmi";

export const RewardsWinner = props => {
  const { payee, erc20Tokens, contractRewardsModuleAddress, abiRewardsModule } = props;
  const { asPath } = useRouter();

  const rewardsModuleContract = {
    addressOrName: contractRewardsModuleAddress,
    contractInterface: abiRewardsModule,
    chainId: chains.filter(chain => chain.name.toLowerCase().replace(" ", "") === asPath.split("/")?.[2])?.[0]?.id,
  };
  const { data, isError, isLoading } = useContractRead({
    ...rewardsModuleContract,
    functionName: "shares",
    args: payee,
  });

  return (
    <>
      <h2 className="font-bold text-md mb-1">Rank {`${payee}`}</h2>
      {isLoading && !data ? (
        <Loader scale="component">Loading rewards data for rank {`${payee}`}...</Loader>
      ) : (
        <>
          {isError && "Something went wrong, please reload the page."}
          {data && (
            <ul className="space-y-3">
              <li>
                <PayeeNativeReward
                  share={data}
                  payee={payee}
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
                        tokenAddress={token.contractAddress}
                        contractRewardsModuleAddress={contractRewardsModuleAddress}
                        abiRewardsModule={abiRewardsModule}
                      />
                    </li>
                  ))}
                </>
              )}
            </ul>
          )}
        </>
      )}
    </>
  );
};

export default RewardsWinner;
