import getContestContractVersion from "@helpers/getContestContractVersion";
import { readContract } from "@wagmi/core";
import { useCallback, useEffect, useState } from "react";
import { Abi } from "viem";

export const VOTES_PER_PAGE = 5;

export function useProposalVotes(contractAddress: string, proposalId: string, chainId: number) {
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [addressesVoted, setAddressesVoted] = useState([]);
  const [votesData, setVotesData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchContractVersion = async (address: string, chainId: number) => {
    const { abi } = await getContestContractVersion(address, chainId);
    if (abi === null) throw new Error("This contract doesn't exist on this chain.");
    return abi;
  };

  const fetchVotesForAddress = useCallback(
    async (address: string) => {
      const abi = await fetchContractVersion(contractAddress, chainId);
      const votes = await readContract({
        address: contractAddress as `0x${string}`,
        abi: abi as unknown as Abi,
        chainId,
        functionName: "proposalAddressVotes",
        args: [proposalId, address],
      });
      return { address, votes };
    },
    [contractAddress, proposalId, chainId],
  );

  const fetchVotesData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { abi } = await getContestContractVersion(contractAddress, chainId);
      const addresses = (await readContract({
        address: contractAddress as `0x${string}`,
        abi: abi as unknown as Abi,
        chainId,
        functionName: "proposalAddressesHaveVoted",
        args: [proposalId],
      })) as any;

      const votesPromises = addresses.map(address => fetchVotesForAddress(address));
      const votesArray = await Promise.all(votesPromises);
      const votesObj = votesArray.reduce((acc, { address, votes }) => {
        acc[address] = votes;
        return acc;
      }, {});

      setVotesData(votesObj);
      setAddressesVoted(addresses);
    } catch (e: any) {
      setError(e.message || "Error fetching votes data");
    } finally {
      setLoading(false);
    }
  }, [contractAddress, proposalId, chainId, fetchVotesForAddress]);

  useEffect(() => {
    fetchVotesData();
  }, [fetchVotesData]);

  return {
    loading,
    error,
    votesData,
    addressesVoted,
  };
}
