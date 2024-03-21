import { useContestStore } from "@hooks/useContest/store";
import { useAccount, useReadContract } from "wagmi";

export const useFetchUserVotesOnProposal = (contestAddress: string, proposalId: string) => {
  const { contestAbi } = useContestStore(state => state);
  const { address, chainId } = useAccount();
  const currentUserVotesOnProposal = useReadContract({
    address: contestAddress as `0x${string}`,
    abi: contestAbi,
    chainId: chainId,
    functionName: "proposalAddressVotes",
    args: [proposalId, address],
    query: {
      select: (data: unknown) => {
        const [positiveVotes, negativeVotes] = data as [bigint, bigint];

        const currentUserVotesOnProposal = (positiveVotes - negativeVotes) / BigInt(1e18);

        return Number(currentUserVotesOnProposal.toString());
      },
      enabled: !!contestAbi && !!proposalId && !!address,
    },
  });

  return { currentUserVotesOnProposal, refetch: currentUserVotesOnProposal.refetch };
};
