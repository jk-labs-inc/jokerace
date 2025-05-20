import { toastError } from "@components/UI/Toast";
import { chains, config } from "@config/wagmi";
import { extractPathSegments } from "@helpers/extractPath";
import { useContestStore } from "@hooks/useContest/store";
import { useError } from "@hooks/useError";
import { readContracts } from "@wagmi/core";
import { usePathname } from "next/navigation";
import { Abi } from "viem";
import { getRewardsModuleAddress, getRewardsModuleInfo } from "lib/rewards/contracts";
import { useRewardsStore } from "./store";
import { ModuleType } from "lib/rewards/types";

export function useRewardsModule() {
  const asPath = usePathname();
  const { contestAbi } = useContestStore(state => state);
  const { chainName: contestChainName, address: contestAddress } = extractPathSegments(asPath ?? "");
  const { setRewards, setIsLoading, setError, setIsSuccess } = useRewardsStore(state => state);
  const { error, handleError } = useError();
  const chainId = chains.filter(
    (chain: { name: string }) => chain.name.toLowerCase().replace(" ", "") === contestChainName.toLowerCase(),
  )?.[0]?.id;

  function getRewardsConfig(rewardsModuleAddress: string, abi: Abi) {
    return {
      address: rewardsModuleAddress as `0x${string}`,
      abi: abi as Abi,
      chainId,
    };
  }

  const fetchRewardsModuleAbi = async (rewardsModuleAddress: string) => {
    try {
      const { abi, moduleType } = await getRewardsModuleInfo(rewardsModuleAddress, chainId);
      return { abi, moduleType };
    } catch (e) {
      handleError(e, "Error fetching rewards module ABI");
      return { abi: null, moduleType: null };
    }
  };

  const fetchRewardsModuleAddress = async (): Promise<string | null> => {
    try {
      if (!contestAbi) {
        setIsLoading(false);
        setIsSuccess(false);
        toastError(`This contract doesn't exist on ${contestChainName}.`);
        return null;
      }

      const contestRewardModuleAddress = await getRewardsModuleAddress({
        address: contestAddress as `0x${string}`,
        abi: contestAbi,
        chainId,
      });

      if (!contestRewardModuleAddress) {
        toastError("Invalid rewards module address.");
        return null;
      }

      return contestRewardModuleAddress;
    } catch (error) {
      handleError(error, "Failed to fetch rewards module address.");
      return null;
    }
  };

  async function getContestRewardsModule() {
    setIsLoading(true);
    setError("");
    setIsSuccess(false);

    const rewardsModuleAddress = await fetchRewardsModuleAddress();
    if (!rewardsModuleAddress) {
      setIsLoading(false);
      toastError(`Rewards module address not found on ${contestChainName}.`);
      return;
    }

    const { abi, moduleType } = await fetchRewardsModuleAbi(rewardsModuleAddress);
    if (!abi) {
      setIsLoading(false);
      toastError(`This contract doesn't exist on ${contestChainName}.`);
      return;
    }

    try {
      const contractsRewardsModule = [
        {
          ...getRewardsConfig(rewardsModuleAddress, abi),
          functionName: "creator",
        },
        {
          ...getRewardsConfig(rewardsModuleAddress, abi),
          functionName: "getPayees",
        },
        {
          ...getRewardsConfig(rewardsModuleAddress, abi),
          functionName: "totalShares",
        },
      ];

      const rewardsModule = await readContracts(config, {
        contracts: contractsRewardsModule,
      });

      const creator = rewardsModule[0].result as string;
      const payees = rewardsModule[1].result as bigint[];
      const totalShares = rewardsModule[2].result as bigint;

      const formattedPayees = payees.map(payee => Number(payee));
      const totalSharesFormatted = Number(totalShares);

      setRewards({
        abi,
        contractAddress: rewardsModuleAddress,
        creator,
        payees: formattedPayees,
        totalShares: totalSharesFormatted,
        moduleType: moduleType ?? ModuleType.VOTER_REWARDS,
        blockExplorers: chains.filter(
          (chain: { name: string }) => chain.name.toLowerCase().replace(" ", "") === contestChainName,
        )?.[0]?.blockExplorers?.default.url,
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

  return {
    getContestRewardsModule,
    fetchRewardsModuleAddress,
  };
}

export default useRewardsModule;
