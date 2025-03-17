import { useContestStore } from "@hooks/useContest/store";
import { compareVersions } from "compare-versions";
import { useAccount, useReadContract } from "wagmi";

export const useFetchUserVotesOnProposal = (contestAddress: string, proposalId: string) => {
  const { contestAbi, version } = useContestStore(state => state);
  const { address, chainId } = useAccount();
  const hasDownvotes = version ? compareVersions(version, "5.1") < 0 : false;

  const currentUserVotesOnProposal = useReadContract({
    address: contestAddress as `0x${string}`,
    abi: contestAbi,
    chainId: chainId,
    functionName: "proposalAddressVotes",
    args: [proposalId, address],
    query: {
      select: (data: unknown) => {
        if (hasDownvotes) {
          const [positiveVotes, negativeVotes] = data as [bigint, bigint];
          const currentUserVotesOnProposal = (positiveVotes - negativeVotes) / BigInt(1e18);
          return Number(currentUserVotesOnProposal.toString());
        } else {
          const voteCount = data as bigint;
          const currentUserVotesOnProposal = voteCount / BigInt(1e18);
          return Number(currentUserVotesOnProposal.toString());
        }
      },
      enabled: !!contestAbi && !!proposalId && !!address,
    },
  });

  return { currentUserVotesOnProposal, refetch: currentUserVotesOnProposal.refetch };
};
