import Button from "@components/Button";
import Loader from "@components/Loader";
import { CheckCircleIcon } from "@heroicons/react/outline";
import { useContractRead } from "wagmi";
import PayeeERC20Reward from "./ERC20Reward";

export const RewardsWinner = props => {
  const { payee, erc20Tokens, contractRewardsModuleAddress, abiRewardsModule } = props;
  const rewardsModuleContract = {
    addressOrName: contractRewardsModuleAddress,
    contractInterface: abiRewardsModule,
  };
  const { data, isError, isLoading } = useContractRead({
    ...rewardsModuleContract,
    functionName: "shares",
    args: payee,
  });

  return (
    <>
      <h2 className="font-bold text-lg mb-1">Rank {`${payee}`}</h2>
      {isLoading ? (
        <Loader scale="component">Loading rewards data for rank {`${payee}`}...</Loader>
      ) : (
        <>
          {isError && "Something went wrong, please reload the page."}
          {data && (
            <>
              {erc20Tokens?.length > 0 && (
                <ul className="space-y-3">
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
                </ul>
              )}
            </>
          )}
        </>
      )}
    </>
  );
};

export default RewardsWinner;
