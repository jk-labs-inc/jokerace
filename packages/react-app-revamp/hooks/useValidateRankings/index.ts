import { useReadContracts } from "wagmi";
import { Abi } from "viem";

interface UseValidateRankingsProps {
  rankings: number[];
  contractAddress: `0x${string}`;
  chainId: number;
  abi: Abi;
  enabled?: boolean;
}

interface ValidateRankingsResult {
  validRankings: number[];
  tiedRankings: number[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}

export const useValidateRankings = ({
  rankings,
  contractAddress,
  chainId,
  abi,
  enabled = true,
}: UseValidateRankingsProps): ValidateRankingsResult => {
  const contracts = rankings.map(ranking => ({
    address: contractAddress,
    chainId,
    abi,
    functionName: "getProposalIdOfRanking",
    args: [BigInt(ranking)],
  }));

  const { data, isLoading, isError, error } = useReadContracts({
    contracts,
    query: {
      enabled: enabled && rankings.length > 0,
      select: data => {
        const validRankings: number[] = [];
        const tiedRankings: number[] = [];

        for (let i = 0; i < rankings.length; i++) {
          const proposalId = data[i]?.result as bigint | undefined;
          if (proposalId !== undefined) {
            if (proposalId === 0n) {
              tiedRankings.push(rankings[i]);
            } else {
              validRankings.push(rankings[i]);
            }
          }
        }

        return { validRankings, tiedRankings };
      },
    },
  });

  return {
    validRankings: data?.validRankings ?? [],
    tiedRankings: data?.tiedRankings ?? [],
    isLoading,
    isError,
    error: error as Error | null,
  };
};
