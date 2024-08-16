import { useQuery } from "@tanstack/react-query";
import { getVoters } from "lib/buckets/voters";
import { Recipient } from "lib/merkletree/generateMerkleTree";

const useVoters = (votingMerkleRoot: string, isV3: boolean) => {
  const fetchVoters = async (): Promise<Recipient[]> => {
    const { voters } = await getVoters(votingMerkleRoot);
    return voters;
  };

  const {
    data: voters,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<Recipient[], Error>({
    queryKey: ["voters", votingMerkleRoot],
    queryFn: fetchVoters,
    enabled: isV3 && !!votingMerkleRoot,
  });

  return {
    voters: voters ?? [],
    isLoading,
    isError,
    error,
    retry: refetch,
  };
};

export default useVoters;
