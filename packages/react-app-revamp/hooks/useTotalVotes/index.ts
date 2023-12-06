import getContestContractVersion from "@helpers/getContestContractVersion";
import { readContract } from "@wagmi/core";
import { fetchDataFromBucket } from "lib/buckets";
import { Recipient } from "lib/merkletree/generateMerkleTree";
import { Abi } from "viem";
import { useTotalVotesOnContestStore } from "./store";

const useTotalVotesOnContest = (address: string, chainId: number) => {
  const { setTotalVotes, setIsError, setIsLoading, setIsSuccess } = useTotalVotesOnContestStore(state => state);

  const calculateTotalVotes = (data: Recipient[]) => {
    return data.reduce((sum, vote) => sum + Number(vote.numVotes), 0);
  };

  async function getContractConfig() {
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
  }

  async function getVotingMerkleRoot() {
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
  }

  async function fetchTotalVotes() {
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
  }

  const retry = () => {
    fetchTotalVotes();
  };

  return { fetchTotalVotes, retry };
};

export default useTotalVotesOnContest;
