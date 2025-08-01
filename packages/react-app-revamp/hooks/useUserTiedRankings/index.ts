import { config } from "@config/wagmi";
import { useQuery } from "@tanstack/react-query";
import { readContract, readContracts } from "@wagmi/core";
import { compareVersions } from "compare-versions";
import { Abi } from "viem";
import { ModuleType } from "lib/rewards/types";

interface UseUserTiedRankingsParams {
  tiedRankings: number[];
  contestAddress: `0x${string}`;
  chainId: number;
  contestAbi: Abi;
  userAddress: `0x${string}`;
  version: string;
  moduleType: ModuleType;
  enabled?: boolean;
}

export const useUserTiedRankings = ({
  tiedRankings,
  contestAddress,
  chainId,
  contestAbi,
  userAddress,
  version,
  moduleType,
  enabled = true,
}: UseUserTiedRankingsParams) => {
  return useQuery({
    queryKey: ["userTiedRankings", contestAddress, chainId, userAddress, tiedRankings, moduleType],
    queryFn: async () => {
      const userTiedRankings: number[] = [];
      const hasDownvotes = compareVersions(version, "5.1") < 0;

      for (const ranking of tiedRankings) {
        try {
          const rankIndex = await readContract(config, {
            address: contestAddress,
            chainId,
            abi: contestAbi,
            functionName: "getRankIndex",
            args: [BigInt(ranking)],
          }) as bigint;

          const sortedRanks = await readContract(config, {
            address: contestAddress,
            chainId,
            abi: contestAbi,
            functionName: "sortedRanks",
            args: [rankIndex],
          }) as bigint;

          const proposalsWithThisManyVotes = await readContract(config, {
            address: contestAddress,
            chainId,
            abi: contestAbi,
            functionName: "getProposalsWithThisManyVotes",
            args: [sortedRanks],
          }) as bigint[];

          if (proposalsWithThisManyVotes.length > 0) {
            if (moduleType === ModuleType.VOTER_REWARDS) {
              // Check if user voted on any of these proposals
              const userVoteChecks = await readContracts(config, {
                contracts: proposalsWithThisManyVotes.map(proposalId => ({
                  address: contestAddress,
                  chainId,
                  abi: contestAbi,
                  functionName: "proposalAddressVotes",
                  args: [proposalId, userAddress],
                })),
              });

              const hasVotedOnAnyProposal = userVoteChecks.some(result => {
                const voteCount = result?.result as bigint | [bigint, bigint] | undefined;
                
                if (!voteCount) return false;

                if (hasDownvotes) {
                  const [forVotes, againstVotes] = voteCount as [bigint, bigint];
                  return (forVotes - againstVotes) > 0n;
                } else {
                  return (voteCount as bigint) > 0n;
                }
              });

              if (hasVotedOnAnyProposal) {
                userTiedRankings.push(ranking);
              }
            } else if (moduleType === ModuleType.AUTHOR_REWARDS) {
              const proposalChecks = await readContracts(config, {
                contracts: proposalsWithThisManyVotes.map(proposalId => ({
                  address: contestAddress,
                  chainId,
                  abi: contestAbi,
                  functionName: "getProposal",
                  args: [proposalId],
                })),
              });

              const hasAuthoredAnyProposal = proposalChecks.some(result => {
                const proposal = result?.result as any;
                return proposal?.author?.toLowerCase() === userAddress.toLowerCase();
              });

              if (hasAuthoredAnyProposal) {
                userTiedRankings.push(ranking);
              }
            }
          }
        } catch (error) {
          console.error(`Error checking ranking ${ranking}:`, error);
        }
      }

      return userTiedRankings;
    },
    enabled: enabled && !!userAddress && !!contestAddress && tiedRankings.length > 0,
  });
};