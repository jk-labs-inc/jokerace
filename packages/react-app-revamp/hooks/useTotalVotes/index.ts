import { config } from "@config/wagmi";
import { useContestStore } from "@hooks/useContest/store";
import { useQuery } from "@tanstack/react-query";
import { readContract } from "@wagmi/core";
import { fetchDataFromBucket } from "lib/buckets";
import { EMPTY_HASH } from "lib/contests/contracts";
import { Recipient } from "lib/merkletree/generateMerkleTree";
import { Abi } from "viem";

const useTotalVotesOnContest = (address: string, chainId: number) => {
  const { contestAbi: abi } = useContestStore(state => state);
  const calculateTotalVotes = (data: Recipient[]) => {
    return data.reduce((sum, vote) => sum + Number(vote.numVotes), 0);
  };

  function getContractConfig() {
    return {
      address: address as `0x${string}`,
      abi: abi as Abi,
      chainId: chainId,
    };
  }

  async function getVotingMerkleRoot() {
    try {
      const contractConfig = getContractConfig();

      const votingMerkleRoot = (await readContract(config, {
        ...contractConfig,
        functionName: "votingMerkleRoot",
      })) as string;

      return votingMerkleRoot;
    } catch (e) {
      return null;
    }
  }

  const fetchTotalVotes = async () => {
    const votingMerkleRoot = await getVotingMerkleRoot();

    if (!votingMerkleRoot) {
      throw new Error("Voting merkle root could not be fetched");
    }

    if (votingMerkleRoot === EMPTY_HASH) {
      return 0;
    }

    const votingMerkleTreeData = await fetchDataFromBucket(votingMerkleRoot);
    if (!votingMerkleTreeData) {
      throw new Error("Voting data could not be fetched");
    }

    return calculateTotalVotes(votingMerkleTreeData);
  };

  const {
    data: totalVotes,
    isLoading: isTotalVotesLoading,
    isError: isTotalVotesError,
    isSuccess: isTotalVotesSuccess,
    refetch: refetchTotalVotes,
  } = useQuery({
    queryKey: ["totalVotes", address, chainId],
    queryFn: fetchTotalVotes,
  });

  return { totalVotes, refetchTotalVotes, isTotalVotesLoading, isTotalVotesError, isTotalVotesSuccess };
};

export default useTotalVotesOnContest;
