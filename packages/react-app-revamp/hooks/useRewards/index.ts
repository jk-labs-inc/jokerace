import { toastError } from "@components/UI/Toast";
import { chains, config } from "@config/wagmi";
import { extractPathSegments } from "@helpers/extractPath";
import getContestContractVersion from "@helpers/getContestContractVersion";
import getRewardsModuleContractVersion from "@helpers/getRewardsModuleContractVersion";
import { useError } from "@hooks/useError";
import { useQuery } from "@tanstack/react-query";
import { readContract, readContracts } from "@wagmi/core";
import { useRouter } from "next/router";
import { Abi } from "viem";
import { useAccount } from "wagmi";
import { useRewardsStore } from "./store";

export function useRewardsModule() {
  const { asPath } = useRouter();
  const { chainName: contestChainName, address: contestAddress } = extractPathSegments(asPath);
  const { chain } = useAccount();
  const { rewards, setRewards, setIsLoading, setError, setIsSuccess } = useRewardsStore(state => state);
  const { error, handleError } = useError();
  const chainId = chains.filter(
    (chain: { name: string }) => chain.name.toLowerCase().replace(" ", "") === contestChainName.toLowerCase(),
  )?.[0]?.id;

  const { refetch: refetchBalanceRewardsModule } = useQuery({
    queryKey: ["balance-rewards-module", rewards?.contractAddress],
    queryFn: async () => {
      try {
        const contestRewardModuleAddress = rewards?.contractAddress;
        const alchemyAppUrl = chains.filter(
          (chain: { name: string }) => chain.name === contestChainName.toLowerCase(),
        )[0].rpcUrls.default.http[0];

        const response = await fetch(alchemyAppUrl, {
          method: "POST",
          body: JSON.stringify({
            jsonrpc: "2.0",
            method: "alchemy_getTokenBalances",
            params: [`${contestRewardModuleAddress}`, "erc20"],
            id: 42,
          }),
          headers: {
            "Content-Type": "application/json",
          },
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
        setIsLoading(false);
        throw e;
      }
    },
    enabled: rewards?.contractAddress && process.env.NEXT_PUBLIC_ALCHEMY_KEY ? true : false,
  });

  async function getContestRewardsModule() {
    setIsLoading(true);
    setError("");
    setIsSuccess(false);

    try {
      const contestRewardModuleAddress = await getContestRewardsAddress();

      if (!contestRewardModuleAddress || contestRewardModuleAddress === "0x0000000000000000000000000000000000000000") {
        toastError("there is no rewards module for this contest!");
        return;
      }

      const abiRewardsModule = await getRewardsModuleContractVersion(contestRewardModuleAddress, chainId);
      if (abiRewardsModule === null) {
        if (contestRewardModuleAddress == "0x0000000000000000000000000000000000000000") {
          toastError("There is no rewards module for this contest.");
        } else {
          toastError(`The rewards pool contract address doesn't exist on ${chain?.name ?? "this chain"}.`);
        }
        return;
      }

      const configRewardsModuleContract = {
        address: contestRewardModuleAddress as `0x${string}`,
        abi: abiRewardsModule as Abi,
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

      const rewardsModule = await readContracts(config, {
        contracts: contractsRewardsModule,
      });

      setRewards({
        abi: abiRewardsModule,
        contractAddress: contestRewardModuleAddress,
        creator: rewardsModule[0],
        payees: rewardsModule[1].result,
        totalShares: rewardsModule[2].result,
        blockExplorers: chains.filter(
          (chain: { name: string }) => chain.name.toLowerCase().replace(" ", "") === contestChainName,
        )?.[0]?.blockExplorers?.default,
      });
      setIsLoading(false);
      setIsSuccess(true);
    } catch (e) {
      handleError(e, "Something went wrong and the rewards module couldn't be retrieved.");
      setError(error);
      setIsLoading(false);
      setIsSuccess(false);
    }
  }

  async function getContestRewardsAddress() {
    const { abi: abiContest } = await getContestContractVersion(contestAddress, chainId);

    if (abiContest === null) {
      setIsLoading(false);
      setIsSuccess(false);
      toastError(`This contract doesn't exist on ${contestChainName}.`);
      return;
    }

    try {
      const contestRewardModuleAddress = (await readContract(config, {
        address: contestAddress as `0x${string}`,
        abi: abiContest as Abi,
        chainId,
        functionName: "officialRewardsModule",
      })) as string;

      return contestRewardModuleAddress;
    } catch (error) {
      handleError(error, "failed to fetch rewards module address.");
      return;
    }
  }

  return {
    getContestRewardsModule,
    getContestRewardsAddress,
    refetchBalanceRewardsModule,
  };
}

export default useRewardsModule;
