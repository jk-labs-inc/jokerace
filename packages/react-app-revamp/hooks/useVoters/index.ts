import { getVoters } from "lib/buckets/voters";
import { Recipient } from "lib/merkletree/generateMerkleTree";
import { useState, useEffect, useCallback } from "react";

const useVoters = (votingMerkleRoot: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [voters, setVoters] = useState<Recipient[]>([]);

  const fetchVoters = useCallback(async () => {
    setIsLoading(true);
    try {
      const { voters } = await getVoters(votingMerkleRoot);
      setVoters(voters);
    } catch (e) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, [votingMerkleRoot]);

  const retry = () => {
    fetchVoters();
  };

  useEffect(() => {
    fetchVoters();
  }, [fetchVoters]);

  return { isLoading, isError, voters, retry };
};

export default useVoters;
