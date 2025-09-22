import { useReadContracts } from "wagmi";
import { formatEther, Abi } from "viem";
import { useContestAbiAndVersion } from "../useContestAbiAndVersion";
import { UseProposalVotesAndRankParams, ProposalVotesAndRankResult, MappedProposal } from "./types";
import { assignRankAndCheckTies } from "./helpers";

const useProposalVotes = ({
  contestAddress,
  proposalId,
  chainId,
  enabled = true,
}: UseProposalVotesAndRankParams): ProposalVotesAndRankResult => {
  //TODO: pass this instead of fetching it from the hook (pass contest address, chainId, abi and version?)
  const {
    abi,
    isLoading: isAbiLoading,
    isError: isAbiError,
  } = useContestAbiAndVersion({
    address: contestAddress,
    chainId,
    enabled,
  });

  const {
    data,
    isLoading: isContractsLoading,
    isError: isContractsError,
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
      select: data => {
        const [proposalVotesResult, allProposalsResult, deletedProposalsResult] = data;

        // Extract individual proposal votes
        const proposalVotes = proposalVotesResult.result
          ? Number(formatEther(proposalVotesResult.result as bigint))
          : 0;

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
          .map((id: bigint, index: number) => ({
            id: id.toString(),
            votes: Number(formatEther(allVotes[index] as bigint)),
          }))
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

  // Combine loading and error states
  const isLoading = isAbiLoading || isContractsLoading;
  const isError = isAbiError || isContractsError;

  return {
    votes: data?.votes ?? 0,
    rank: data?.rank ?? 0,
    isTied: data?.isTied ?? false,
    isLoading,
    isError,
    error,
    refetch,
  };
};

export default useProposalVotes;
