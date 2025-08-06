import { useContestStore } from "@hooks/useContest/store";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useReadContract } from "wagmi";
import { readContracts } from "@wagmi/core";
import { config } from "@config/wagmi";
import { formatEther } from "ethers";
import { compareVersions } from "compare-versions";
import { useMemo } from "react";

export const VOTES_PER_PAGE = 4;

interface VoteEntry {
  address: string;
  votes: bigint | [bigint, bigint];
  formattedVotes?: number;
}

interface ProposalVotesData {
  votes: VoteEntry[];
  totalAddresses: number;
  hasMore: boolean;
  pageIndex: number;
}

export function useProposalVotes(
  contractAddress: string,
  proposalId: string,
  chainId: number,
  addressPerPage = VOTES_PER_PAGE,
) {
  const { contestAbi: abi, version } = useContestStore(state => state);
  const hasDownvotes = version ? compareVersions(version, "5.1") < 0 : false;

  const {
    data: addressesVoted,
    isLoading: isLoadingAddresses,
    error: addressesError,
    refetch: refetchAddresses,
  } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: abi,
    chainId,
    functionName: "proposalAddressesHaveVoted",
    args: [proposalId],
    query: {
      enabled: !!contractAddress && !!proposalId && !!abi,
    },
  }) as {
    data: string[] | undefined;
    isLoading: boolean;
    error: Error | null;
    refetch: () => Promise<any>;
  };

  const {
    data,
    isLoading: isLoadingVotes,
    error: votesError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["proposalVotes", contractAddress, proposalId, chainId, hasDownvotes, addressesVoted],
    queryFn: async ({ pageParam = 0 }): Promise<ProposalVotesData> => {
      if (!addressesVoted || addressesVoted.length === 0) {
        return { votes: [], totalAddresses: 0, hasMore: false, pageIndex: 0 };
      }

      const start = pageParam * addressPerPage;
      const end = Math.min(start + addressPerPage, addressesVoted.length);
      const addressesPage = addressesVoted.slice(start, end);

      const contracts = addressesPage.map(address => ({
        address: contractAddress as `0x${string}`,
        abi: abi,
        chainId,
        functionName: "proposalAddressVotes",
        args: [proposalId, address],
      }));

      const results = await readContracts(config, { contracts });

      const votes: VoteEntry[] = addressesPage.map((address, index) => {
        const result = results[index];
        const voteData = result?.result as bigint | [bigint, bigint] | undefined;

        if (!voteData) {
          return {
            address,
            votes: hasDownvotes ? [BigInt(0), BigInt(0)] : BigInt(0),
            formattedVotes: 0,
          };
        }

        // Calculate net votes
        let netVotes: bigint;
        if (hasDownvotes && Array.isArray(voteData)) {
          netVotes = voteData[0] - voteData[1];
        } else {
          netVotes = voteData as bigint;
        }

        return {
          address,
          votes: voteData,
          formattedVotes: Number(formatEther(netVotes.toString())),
        };
      });

      return {
        votes,
        totalAddresses: addressesVoted.length,
        hasMore: end < addressesVoted.length,
        pageIndex: pageParam,
      };
    },
    getNextPageParam: lastPage => {
      return lastPage.hasMore ? lastPage.pageIndex + 1 : undefined;
    },
    initialPageParam: 0,
    enabled: !!addressesVoted && addressesVoted.length > 0,
  });

  const accumulatedVotesData = useMemo(() => {
    if (!data?.pages) return {};

    return data.pages.reduce((acc, page) => {
      page.votes.forEach(({ address, formattedVotes }) => {
        if (formattedVotes !== undefined) {
          acc[address] = formattedVotes;
        }
      });
      return acc;
    }, {} as Record<string, number>);
  }, [data]);

  const currentPage = useMemo(() => {
    return data?.pages?.length ? data.pages.length - 1 : 0;
  }, [data]);

  const totalPages = useMemo(() => {
    return addressesVoted ? Math.ceil(addressesVoted.length / addressPerPage) : 0;
  }, [addressesVoted, addressPerPage]);

  const isLoading = isLoadingAddresses || (isLoadingVotes && !data);
  const error = addressesError || votesError;

  return {
    isLoading,
    isFetchingNextPage,
    error: error?.message || null,
    accumulatedVotesData,
    addressesVoted: addressesVoted || [],
    currentPage,
    totalPages,
    hasNextPage: hasNextPage ?? false,
    fetchNextPage,
  };
}
