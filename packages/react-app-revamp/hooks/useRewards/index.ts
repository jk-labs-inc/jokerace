import { chains, config } from "@config/wagmi";
import { extractPathSegments } from "@helpers/extractPath";
import { useContestStore } from "@hooks/useContest/store";
import { useQuery } from "@tanstack/react-query";
import { readContracts } from "@wagmi/core";
import { getRewardsModuleAddress, getRewardsModuleInfo } from "lib/rewards/contracts";
import { ModuleType, RewardModuleInfo } from "lib/rewards/types";
import { usePathname } from "next/navigation";
import { Abi } from "viem";
import { useShallow } from "zustand/react/shallow";

export function useRewardsModule() {
  const asPath = usePathname();
  const contestAbi = useContestStore(useShallow(state => state.contestAbi));
  const { chainName: contestChainName, address: contestAddress } = extractPathSegments(asPath ?? "");
  const chainId = chains.filter(
    (chain: { name: string }) => chain.name.toLowerCase().replace(" ", "") === contestChainName.toLowerCase(),
  )?.[0]?.id;

  const getRewardsConfig = (rewardsModuleAddress: string, abi: Abi) => ({
    address: rewardsModuleAddress as `0x${string}`,
    abi: abi as Abi,
    chainId,
  });

  const fetchContestRewardsModule = async (): Promise<RewardModuleInfo | null> => {
    if (!contestAddress || !contestAbi || !chainId) {
      return null;
    }

    const rewardsConfig = getRewardsConfig(contestAddress as `0x${string}`, contestAbi);

    const rewardsModuleAddress = await getRewardsModuleAddress(rewardsConfig);
    if (!rewardsModuleAddress) {
      return null;
    }

    const { abi, moduleType } = await getRewardsModuleInfo(rewardsModuleAddress, chainId);
    if (!abi) {
      throw new Error("Failed to get rewards module ABI");
    }

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

    return {
      abi,
      contractAddress: rewardsModuleAddress,
      creator,
      payees: formattedPayees,
      totalShares: totalSharesFormatted,
      moduleType: moduleType ?? ModuleType.VOTER_REWARDS,
      blockExplorers: chains.filter(
        (chain: { name: string }) => chain.name.toLowerCase().replace(" ", "") === contestChainName,
      )?.[0]?.blockExplorers?.default.url,
    };
  };

  return useQuery({
    queryKey: ["rewards-module", contestAddress, contestAbi, chainId],
    queryFn: fetchContestRewardsModule,
    enabled: Boolean(contestAddress && contestAbi && chainId),
    staleTime: Infinity,
  });
}

export default useRewardsModule;
