import { Abi } from "viem";
import { useReadContracts } from "wagmi";

interface ContestTimingsProps {
  contestAddress: string;
  contestChainId: number;
  contestAbi: Abi;
}

const useContestVoteDeadline = ({ contestAddress, contestChainId, contestAbi }: ContestTimingsProps) => {
  const { data, isLoading, error } = useReadContracts({
    contracts: [
      {
        address: contestAddress as `0x${string}`,
        abi: contestAbi,
        chainId: contestChainId,
        functionName: "voteStart",
        args: [],
      },
      {
        address: contestAddress as `0x${string}`,
        chainId: contestChainId,
        abi: contestAbi,
        functionName: "contestDeadline",
        args: [],
      },
    ],
  });

  return {
    voteStart: data?.[0]?.result,
    contestDeadline: data?.[1]?.result,
    isLoading,
    error,
  };
};

export default useContestVoteDeadline;
