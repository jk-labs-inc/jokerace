import { useRouter } from "next/router";
import { chains } from "@config/wagmi";
import getContestContractVersion from "@helpers/getContestContractVersion";
import getRewardsModuleContractVersion from "@helpers/getRewardsModuleContractVersion";
import { alchemyRpcUrls, readContract, readContracts } from "@wagmi/core";
import { useRewardsStore } from "./store";
import { useNetwork, useQuery } from "wagmi";
import { CustomError } from "types/error";
import { toast } from "react-toastify";

export function useRewardsModule() {
  const { asPath } = useRouter();
  const { chain } = useNetwork();

  const { rewards, setRewards, setIsLoading, setError, setIsSuccess } = useRewardsStore(state => state);

  const queryBalanceRewardsModule = useQuery(
    ["balance-rewards-module", rewards?.contractAddress],
    async () => {
      try {
        // Get rewards module contract balance
        // See: https://docs.alchemy.com/docs/how-to-get-all-tokens-owned-by-an-address
        const contestChainName = asPath.split("/")[2];
        const contestRewardModuleAddress = rewards?.contractAddress;
        const alchemyRpc = Object.keys(alchemyRpcUrls).filter(url => url.toLowerCase() === contestChainName)[0];
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
        // Remove tokens with zero balance
        const balance = asJson.result?.tokenBalances?.filter((token: any) => {
          return token["tokenBalance"] !== "0";
        });
        setRewards({
          ...rewards,
          balance: balance,
        });
        return balance;
      } catch (e) {
        console.error(e);
      }
    },
    {
      enabled: rewards?.contractAddress && process.env.NEXT_PUBLIC_ALCHEMY_KEY ? true : false,
      onError(e) {
        const customError = e as CustomError;

        if (!customError) return;
        const message =
          customError.message ||
          "Something went wrong and the balance of the rewards module couldn't be retrieved. Try to reload the page.";
        toast.error(message);
        setError({
          code: customError.code,
          message,
        });
      },
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
      const { abi: abiContest, version } = await getContestContractVersion(address ?? "", chainName ?? "");

      if (abiContest === null) {
        setIsLoading(false);
        setError({
          message: `This contract doesn't exist on ${chain?.name ?? "this chain"}.`,
        });
        setIsSuccess(false);
        toast.error(`This contract doesn't exist on ${chain?.name ?? "this chain"}.`);
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
          toast.error("There is no rewards module for this contest.");
        } else {
          toast.error(`The rewards pool contract address doesn't exist on ${chain?.name ?? "this chain"}.`);
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

      const message = customError.message || "Something went wrong.";
      toast.error(message);
      setError({
        code: customError.code,
        message,
      });
      setIsLoading(false);
    }
  }

  return {
    getContestRewardsModule,
    queryBalanceRewardsModule,
  };
}

export default useRewardsModule;
