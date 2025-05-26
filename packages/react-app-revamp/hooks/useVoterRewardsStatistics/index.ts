import { config } from "@config/wagmi";
import { useContestStore } from "@hooks/useContest/store";
import { useQuery } from "@tanstack/react-query";
import { formatEther } from "ethers";
import { useAccount } from "wagmi";
import { readContract } from "@wagmi/core";
import { useRewardsStore } from "@hooks/useRewards/store";
import { useShallow } from "zustand/react/shallow";
import { compareVersions } from "compare-versions";

export interface VoterRewardsStatistics {
  userVotes: bigint;
  totalVotes: bigint;
  rewardsPercentage: number;
  userVotesFormatted: string;
  totalVotesFormatted: string;
}

export const useVoterRewardsStatistics = (
  contractAddress: string,
  rewardsContractAddress: string,
  ranking: number,
  chainId: number,
) => {
  const { address } = useAccount();
  const { contestAbi, version } = useContestStore(useShallow(state => state));
  const { rewards } = useRewardsStore(useShallow(state => state));

  const hasDownvotes = version ? compareVersions(version, "5.1") < 0 : false;

  const fetchProposalId = async () => {
    try {
      const proposalId = await readContract(config, {
        address: rewardsContractAddress as `0x${string}`,
        abi: rewards.abi,
        chainId,
        functionName: "getProposalIdOfRanking",
        args: [BigInt(ranking)],
      });

      return proposalId as bigint;
    } catch (error) {
      console.error("Failed to fetch proposal ID:", error);
      throw error;
    }
  };

  const fetchUserVotes = async (proposalId: bigint) => {
    if (!address) return BigInt(0);

    try {
      const votes = await readContract(config, {
        address: contractAddress as `0x${string}`,
        abi: contestAbi,
        chainId,
        functionName: "proposalAddressVotes",
        args: [proposalId, address],
      });

      if (hasDownvotes) {
        const [forVotes, againstVotes] = votes as [bigint, bigint];
        return forVotes - againstVotes;
      } else {
        return votes as bigint;
      }
    } catch (error) {
      console.error("Failed to fetch user votes:", error);
      return BigInt(0);
    }
  };

  const fetchTotalVotes = async (proposalId: bigint) => {
    try {
      const votes = await readContract(config, {
        address: contractAddress as `0x${string}`,
        abi: contestAbi,
        chainId,
        functionName: "proposalVotes",
        args: [proposalId],
      });

      if (hasDownvotes) {
        const [forVotes, againstVotes] = votes as [bigint, bigint];
        return forVotes - againstVotes;
      } else {
        return votes as bigint;
      }
    } catch (error) {
      console.error("Failed to fetch total votes:", error);
      return BigInt(0);
    }
  };

  const calculateRewardsPercentage = (userVotes: bigint, totalVotes: bigint) => {
    if (totalVotes === BigInt(0) || userVotes === BigInt(0)) return 0;

    // Convert to number for percentage calculation
    const userVotesNumber = Number(formatEther(userVotes));
    const totalVotesNumber = Number(formatEther(totalVotes));

    // Calculate percentage and format to max 2 decimals
    const percentage = (userVotesNumber / totalVotesNumber) * 100;
    return Number(percentage.toFixed(2));
  };

  const fetchStatistics = async (): Promise<VoterRewardsStatistics | null> => {
    const proposalId = await fetchProposalId();

    // If proposalId is 0, it means there's a tie or the rank is below a tied ranking
    if (proposalId === BigInt(0)) return null;

    const [userVotes, totalVotes] = await Promise.all([fetchUserVotes(proposalId), fetchTotalVotes(proposalId)]);

    const rewardsPercentage = calculateRewardsPercentage(userVotes, totalVotes);

    return {
      userVotes,
      totalVotes,
      rewardsPercentage,
      userVotesFormatted: formatEther(userVotes),
      totalVotesFormatted: formatEther(totalVotes),
    };
  };

  const {
    data: statistics,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["voterRewardsStatistics", contractAddress, rewardsContractAddress, ranking, chainId, address],
    queryFn: fetchStatistics,
    enabled: !!contractAddress && !!rewardsContractAddress && !!chainId && ranking > 0,
  });

  return {
    statistics,
    isLoading,
    isError,
    error,
    refetch,
  };
};
