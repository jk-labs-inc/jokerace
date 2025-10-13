import { config } from "@config/wagmi";
import { useQuery } from "@tanstack/react-query";
import { readContracts } from "@wagmi/core";
import { formatEther } from "viem";

interface VoterWithVotes {
  address: string;
  votes: bigint | [bigint, bigint];
  formattedVotes: number;
}

interface UseProposalVoterVotesProps {
  contractAddress: string;
  proposalId: string;
  chainId: number;
  abi: any;
  addresses: string[];
  page: number;
  pageSize: number;
  hasDownvotes: boolean;
}

export const useProposalVoterVotes = ({
  contractAddress,
  proposalId,
  chainId,
  abi,
  addresses,
  page,
  pageSize,
  hasDownvotes,
}: UseProposalVoterVotesProps) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["proposalVoterVotes", contractAddress, proposalId, chainId, page, addresses.length],
    queryFn: async (): Promise<VoterWithVotes[]> => {
      if (!addresses.length) return [];

      const start = page * pageSize;
      const end = Math.min(start + pageSize, addresses.length);
      const addressesPage = addresses.slice(start, end);

      const contracts = addressesPage.map(address => ({
        address: contractAddress as `0x${string}`,
        abi,
        chainId,
        functionName: "proposalAddressVotes",
        args: [proposalId, address],
      }));

      const results = await readContracts(config, { contracts });

      return addressesPage.map((address, index) => {
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
          formattedVotes: Number(formatEther(netVotes)),
        };
      });
    },
    enabled: !!contractAddress && !!proposalId && !!abi && addresses.length > 0,
    gcTime: 0,
  });

  return {
    voters: data || [],
    isLoading,
    error,
    refetch,
  };
};
