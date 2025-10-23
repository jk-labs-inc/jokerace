import { chains, config } from "@config/wagmi";
import useContestConfigStore from "@hooks/useContestConfig/store";
import { useQuery } from "@tanstack/react-query";
import { readContracts } from "@wagmi/core";
import { getRewardsModuleAddress, getRewardsModuleInfo } from "lib/rewards/contracts";
import { ModuleType, RewardModuleInfo } from "lib/rewards/types";
import { Abi } from "viem";

export function useRewardsModule() {
  const { contestConfig } = useContestConfigStore(state => state);

  const getRewardsConfig = (rewardsModuleAddress: string, abi: Abi) => ({
    address: rewardsModuleAddress as `0x${string}`,
    abi: abi as Abi,
    chainId: contestConfig.chainId,
  });

  const fetchContestRewardsModule = async (): Promise<RewardModuleInfo | null> => {
    if (!contestConfig.address || !contestConfig.abi || !contestConfig.chainId) {
      return null;
    }

    const rewardsConfig = getRewardsConfig(contestConfig.address as `0x${string}`, contestConfig.abi);

    const rewardsModuleAddress = await getRewardsModuleAddress(rewardsConfig);
    if (!rewardsModuleAddress) {
      return null;
    }

    const { abi, moduleType } = await getRewardsModuleInfo(rewardsModuleAddress, contestConfig.chainId);
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
      {
        ...contestConfig,
        functionName: "creatorSplitDestination",
      },
    ];

    const rewardsModule = await readContracts(config, {
      contracts: contractsRewardsModule,
    });

    const creator = rewardsModule[0].result as string;
    const payeeRankings = rewardsModule[1].result as bigint[];
    const totalShares = rewardsModule[2].result as bigint;
    const creatorSplitDestination = rewardsModule[3].result as string;
    const shareContracts = payeeRankings.map(ranking => ({
      ...getRewardsConfig(rewardsModuleAddress, abi),
      functionName: "shares",
      args: [ranking],
    }));

    const sharesResults = await readContracts(config, {
      contracts: shareContracts,
    });

    const formattedPayees = payeeRankings.map(payee => Number(payee));
    const formattedPayeeShares = sharesResults.map(result => Number(result.result as bigint));
    const totalSharesFormatted = Number(totalShares);
    const isSelfFunded = creatorSplitDestination.toLowerCase() === rewardsModuleAddress.toLowerCase();

    return {
      abi,
      contractAddress: rewardsModuleAddress,
      creator,
      payees: formattedPayees,
      payeeShares: formattedPayeeShares,
      totalShares: totalSharesFormatted,
      moduleType: moduleType ?? ModuleType.VOTER_REWARDS,
      blockExplorers: chains.filter(
        (chain: { name: string }) => chain.name.toLowerCase().replace(" ", "") === contestConfig.chainName,
      )?.[0]?.blockExplorers?.default.url,
      isSelfFunded,
    };
  };

  return useQuery({
    queryKey: ["rewards-module", contestConfig.address, contestConfig.abi, contestConfig.chainId],
    queryFn: fetchContestRewardsModule,
    enabled: Boolean(contestConfig.address && contestConfig.abi && contestConfig.chainId),
    staleTime: Infinity,
  });
}

export default useRewardsModule;
