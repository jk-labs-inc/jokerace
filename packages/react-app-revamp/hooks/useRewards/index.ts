import { toastError } from "@components/UI/Toast";
import { chains } from "@config/wagmi";
import getContestContractVersion from "@helpers/getContestContractVersion";
import getRewardsModuleContractVersion from "@helpers/getRewardsModuleContractVersion";
import { alchemyRpcUrls, readContract, readContracts } from "@wagmi/core";
import { useRouter } from "next/router";
import { CustomError } from "types/error";
import { useNetwork, useQuery } from "wagmi";
import { useRewardsStore } from "./store";

export function useRewardsModule() {
  const { asPath } = useRouter();
  const { chain } = useNetwork();
  const { rewards, setRewards, setIsLoading, setError, setIsSuccess } = useRewardsStore(state => state);

  const { refetch: refetchBalanceRewardsModule } = useQuery(
    ["balance-rewards-module", rewards?.contractAddress],
    async () => {
      try {
        const contestChainName = asPath.split("/")[2];
        const contestRewardModuleAddress = rewards?.contractAddress;
        const networkName = contestChainName.toLowerCase() === "arbitrumone" ? "arbitrum" : contestChainName;
        const alchemyRpc = Object.keys(alchemyRpcUrls).filter(url => url.toLowerCase() === networkName)[0];
        //@ts-ignore
        const alchemyAppUrl = `${alchemyRpcUrls[alchemyRpc]}/${process.env.NEXT_PUBLIC_ALCHEMY_KEY}`;

        const response = await fetch(alchemyAppUrl, {
          method: "POST",
          body: JSON.stringify({
            jsonrpc: "2.0",
            method: "alchemy_getTokenBalances",
            headers: {
              "Content-Type": "application/json",
            },
            params: [`${contestRewardModuleAddress}`, "erc20"],
            id: 42,
          }),
          redirect: "follow",
        });

        const asJson = await response.json();
        const balances = asJson.result?.tokenBalances;

        setRewards({
          ...rewards,
          balance: balances,
        });

        return balances;
      } catch (e) {
        console.error(e);
      }
    },
    {
      enabled: rewards?.contractAddress && process.env.NEXT_PUBLIC_ALCHEMY_KEY ? true : false,
    },
  );

  async function getContestRewardsModule(address?: string, chainName?: string) {
    setIsLoading(true);
    setError(null);
    setIsSuccess(false);

    try {
      const contestAddress = address ?? asPath.split("/")[3];
      const contestChainName = chainName ?? asPath.split("/")[2];
      const chainId = chains.filter(chain => chain.name.toLowerCase().replace(" ", "") === contestChainName)?.[0]?.id;
      const { abi: abiContest, version } = await getContestContractVersion(
        address ?? contestAddress,
        chainName ?? contestChainName,
      );

      if (abiContest === null) {
        setIsLoading(false);
        setError({
          message: `This contract doesn't exist on ${chain?.name ?? "this chain"}.`,
        });
        setIsSuccess(false);
        toastError(`This contract doesn't exist on ${chain?.name ?? "this chain"}.`);
        return;
      }
      const contestRewardModuleAddress = await readContract({
        addressOrName: contestAddress,
        contractInterface: abiContest,
        chainId,
        functionName: "officialRewardsModule",
      });
      //@ts-ignore
      const abiRewardsModule = await getRewardsModuleContractVersion(contestRewardModuleAddress, contestChainName);
      if (abiRewardsModule === null) {
        if (contestRewardModuleAddress.toString() == "0x0000000000000000000000000000000000000000") {
          toastError("There is no rewards module for this contest.");
        } else {
          toastError(`The rewards pool contract address doesn't exist on ${chain?.name ?? "this chain"}.`);
        }
        return;
      }

      const configRewardsModuleContract = {
        addressOrName: contestRewardModuleAddress,
        contractInterface: abiRewardsModule,
        chainId,
      };
      const contractsRewardsModule = [
        {
          ...configRewardsModuleContract,
          functionName: "creator",
        },
        {
          ...configRewardsModuleContract,
          functionName: "getPayees",
        },
        {
          ...configRewardsModuleContract,
          functionName: "totalShares",
        },
      ];

      const rewardsModule = await readContracts({
        //@ts-ignore
        contracts: contractsRewardsModule,
      });
      setIsLoading(false);
      setRewards({
        abi: abiRewardsModule,
        contractAddress: contestRewardModuleAddress,
        creator: rewardsModule[0],
        payees: rewardsModule[1],
        totalShares: rewardsModule[2],
        blockExplorers: chains.filter(chain => chain.name.toLowerCase().replace(" ", "") === contestChainName)?.[0]
          ?.blockExplorers?.default,
      });
      setIsSuccess(true);
    } catch (e) {
      const customError = e as CustomError;

      if (!customError) return;

      toastError("Something went wrong and the rewards module couldn't be retrieved.", customError.message);
      setError({
        code: customError.code,
        message: customError.message,
      });
      setIsLoading(false);
    }
  }

  return {
    getContestRewardsModule,
    refetchBalanceRewardsModule,
  };
}

export default useRewardsModule;
