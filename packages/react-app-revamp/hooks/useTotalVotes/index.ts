import { useCallback, useEffect, useState } from "react";
import { fetchDataFromBucket } from "lib/buckets";
import { Recipient } from "lib/merkletree/generateMerkleTree";
import getContestContractVersion from "@helpers/getContestContractVersion";
import { Abi } from "viem";
import { readContract } from "@wagmi/core";

const useTotalVotesOnContest = (address: string, chainId: number) => {
  const [totalVotes, setTotalVotes] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const calculateTotalVotes = (data: Recipient[]) => {
    return data.reduce((sum, vote) => sum + Number(vote.numVotes), 0);
  };

  const getContractConfig = useCallback(async () => {
    try {
      const { abi } = await getContestContractVersion(address, chainId);

      if (abi === null) {
        setIsError(true);
        setIsSuccess(false);
        setIsLoading(false);
        return null;
      }

      return {
        address: address as `0x${string}`,
        abi: abi as unknown as Abi,
        chainId: chainId,
      };
    } catch (e) {
      setIsError(true);
      setIsSuccess(false);
      setIsLoading(false);
      return null;
    }
  }, [address, chainId]);

  const getVotingMerkleRoot = useCallback(async () => {
    try {
      const contractConfig = await getContractConfig();
      if (!contractConfig) return null;

      const votingMerkleRoot = (await readContract({
        ...contractConfig,
        functionName: "votingMerkleRoot",
        args: [],
      })) as string;

      return votingMerkleRoot;
    } catch (e) {
      setIsError(true);
      setIsSuccess(false);
      setIsLoading(false);
      return null;
    }
  }, [getContractConfig]);

  const fetchTotalVotes = useCallback(async () => {
    if (totalVotes > 0) return;

    setIsLoading(true);
    setIsError(false);

    try {
      const votingMerkleRoot = await getVotingMerkleRoot();

      if (!votingMerkleRoot) {
        setIsError(true);
        setIsLoading(false);
        return;
      }

      const votingMerkleTreeData = await fetchDataFromBucket(votingMerkleRoot);

      if (!votingMerkleTreeData) {
        setIsError(true);
        setIsLoading(false);
        return;
      }

      const total = calculateTotalVotes(votingMerkleTreeData);
      setTotalVotes(total);
      setIsSuccess(true);
    } catch (error) {
      setIsError(true);
    }

    setIsLoading(false);
  }, [getVotingMerkleRoot, totalVotes]);

  const retry = () => {
    fetchTotalVotes();
  };

  useEffect(() => {
    fetchTotalVotes();
  }, [fetchTotalVotes]);

  return { totalVotes, isLoading, isError, isSuccess, retry };
};

export default useTotalVotesOnContest;
