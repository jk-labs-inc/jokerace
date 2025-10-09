import { compareVersions } from "compare-versions";
import { Abi, formatEther } from "viem";
import { useReadContracts } from "wagmi";
import { assignRankAndCheckTies } from "./helpers";
import { MappedProposal, ProposalVotesAndRankResult, UseProposalVotesAndRankParams } from "./types";

const useProposalVotes = ({
  contestAddress,
  proposalId,
  chainId,
  abi,
  version,
  enabled = true,
}: UseProposalVotesAndRankParams): ProposalVotesAndRankResult => {
  const hasDownvotes = version ? compareVersions(version, "5.1") < 0 : false;

  const {
    data,
    isLoading: isContractsLoading,
    isError: isContractsError,
    isRefetching: isContractsRefetching,
    error,
    refetch,
  } = useReadContracts({
    contracts: [
      {
        address: contestAddress as `0x${string}`,
        abi: abi as Abi,
        functionName: "proposalVotes",
        args: [proposalId],
        chainId,
      },
      {
        address: contestAddress as `0x${string}`,
        abi: abi as Abi,
        functionName: "allProposalTotalVotes",
        args: [],
        chainId,
      },
      {
        address: contestAddress as `0x${string}`,
        abi: abi as Abi,
        functionName: "getAllDeletedProposalIds",
        args: [],
        chainId,
      },
    ],
    query: {
      enabled: enabled && !!abi && !!proposalId && !!contestAddress && !!chainId,
      gcTime: 0,
      select: data => {
        const [proposalVotesResult, allProposalsResult, deletedProposalsResult] = data;

        let proposalVotes = 0;

        if (proposalVotesResult.result) {
          if (hasDownvotes) {
            const voteForBigInt = BigInt((proposalVotesResult.result as any)[0]);
            const voteAgainstBigInt = BigInt((proposalVotesResult.result as any)[1]);
            proposalVotes = Number(formatEther(voteForBigInt - voteAgainstBigInt));
          } else {
            proposalVotes = Number(formatEther(proposalVotesResult.result as bigint));
          }
        }

        // If no votes, return early
        if (proposalVotes === 0) {
          return { votes: 0, rank: 0, isTied: false };
        }

        // Extract all proposals data for ranking
        if (!allProposalsResult.result || !Array.isArray(allProposalsResult.result)) {
          return { votes: proposalVotes, rank: 0, isTied: false };
        }

        const allProposals = (allProposalsResult.result as any[])[0];
        const allVotes = (allProposalsResult.result as any[])[1];
        const deletedIds = deletedProposalsResult.result || [];

        // Filter out deleted proposals
        const deletedProposalSet = new Set(
          Array.isArray(deletedIds) ? deletedIds.map((id: bigint) => id.toString()) : [deletedIds.toString()],
        );

        // Map valid proposals with their votes
        const mappedProposals: MappedProposal[] = allProposals
          .map((id: bigint, index: number) => {
            let votes = 0;
            if (hasDownvotes) {
              const voteForBigInt = BigInt(allVotes[index][0]);
              const voteAgainstBigInt = BigInt(allVotes[index][1]);
              votes = Number(formatEther(voteForBigInt - voteAgainstBigInt));
            } else {
              votes = Number(formatEther(allVotes[index] as bigint));
            }
            return {
              id: id.toString(),
              votes,
            };
          })
          .filter((proposal: MappedProposal) => !deletedProposalSet.has(proposal.id));

        // Calculate rank and ties
        const rankInfo = assignRankAndCheckTies(mappedProposals, proposalId);

        return {
          votes: proposalVotes,
          ...rankInfo,
        };
      },
    },
  });

  return {
    votes: data?.votes ?? 0,
    rank: data?.rank ?? 0,
    isTied: data?.isTied ?? false,
    isLoading: isContractsLoading,
    isError: isContractsError,
    isRefetching: isContractsRefetching,
    error,
    refetch,
  };
};

export default useProposalVotes;
