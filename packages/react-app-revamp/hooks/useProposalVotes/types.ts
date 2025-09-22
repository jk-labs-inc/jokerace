export interface UseProposalVotesAndRankParams {
  contestAddress: string;
  proposalId: string;
  chainId: number;
  enabled?: boolean;
}

export interface ProposalVotesAndRankResult {
  votes: number;
  rank: number;
  isTied: boolean;
  isLoading: boolean;
  isError: boolean;
  error: any;
  refetch: () => void;
}

export interface MappedProposal {
  id: string;
  votes: number;
}
