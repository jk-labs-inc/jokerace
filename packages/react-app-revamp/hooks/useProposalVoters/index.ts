import useContestConfigStore from "@hooks/useContestConfig/store";
import { compareVersions } from "compare-versions";
import { useMemo, useState } from "react";
import { useShallow } from "zustand/shallow";
import { useProposalVoterAddresses } from "./hooks/useProposalVoterAddresses";
import { useProposalVoterVotes } from "./hooks/useProposalVoterVotes";

export const VOTES_PER_PAGE = 4;

export const useProposalVoters = (
  contractAddress: string,
  proposalId: string,
  chainId: number,
  pageSize: number = VOTES_PER_PAGE,
) => {
  const [currentPage, setCurrentPage] = useState(0);

  const { abi, version } = useContestConfigStore(
    useShallow(state => ({
      abi: state.contestConfig.abi,
      version: state.contestConfig.version,
    })),
  );

  const hasDownvotes = version ? compareVersions(version, "5.1") < 0 : false;

  // Step 1: Fetch all addresses that voted
  const {
    addresses,
    totalCount,
    isLoading: isLoadingAddresses,
    error: addressesError,
    refetch: refetchAddresses,
  } = useProposalVoterAddresses({
    contractAddress,
    proposalId,
    chainId,
    abi,
  });

  // Step 2: Fetch votes for current page
  const {
    voters,
    isLoading: isLoadingVotes,
    error: votesError,
    refetch: refetchVotes,
  } = useProposalVoterVotes({
    contractAddress,
    proposalId,
    chainId,
    abi,
    addresses,
    page: currentPage,
    pageSize,
    hasDownvotes,
  });

  // Pagination helpers
  const totalPages = useMemo(() => {
    return Math.ceil(totalCount / pageSize);
  }, [totalCount, pageSize]);

  const hasNextPage = currentPage < totalPages - 1;
  const hasPreviousPage = currentPage > 0;

  const goToNextPage = () => {
    if (hasNextPage) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const goToPreviousPage = () => {
    if (hasPreviousPage) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const goToPage = (page: number) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page);
    }
  };

  const accumulatedVotesData = useMemo(() => {
    return voters.reduce((acc, { address, formattedVotes }) => {
      acc[address] = formattedVotes;
      return acc;
    }, {} as Record<string, number>);
  }, [voters]);

  // Unified refetch function
  const refetch = async () => {
    await refetchAddresses();
    await refetchVotes();
  };

  const isLoading = isLoadingAddresses || isLoadingVotes;
  const error = addressesError || votesError;

  return {
    voters,
    addressesVoted: addresses,
    accumulatedVotesData,
    totalCount,
    currentPage,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    goToNextPage,
    goToPreviousPage,
    goToPage,
    fetchNextPage: goToNextPage,
    isFetchingNextPage: isLoadingVotes,
    isLoading,
    error: error?.message || null,
    refetch,
  };
};
