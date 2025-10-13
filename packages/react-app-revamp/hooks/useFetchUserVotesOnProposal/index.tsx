import useContestConfigStore from "@hooks/useContestConfig/store";
import { compareVersions } from "compare-versions";
import { useAccount, useReadContract } from "wagmi";
import { useShallow } from "zustand/shallow";

export const useFetchUserVotesOnProposal = (contestAddress: string, proposalId: string) => {
  const { abi, version } = useContestConfigStore(
    useShallow(state => ({
      abi: state.contestConfig.abi,
      version: state.contestConfig.version,
    })),
  );
  const { address, chainId } = useAccount();
  const hasDownvotes = version ? compareVersions(version, "5.1") < 0 : false;

  const currentUserVotesOnProposal = useReadContract({
    address: contestAddress as `0x${string}`,
    abi,
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
      enabled: !!abi && !!proposalId && !!address,
    },
  });

  return { currentUserVotesOnProposal, refetch: currentUserVotesOnProposal.refetch };
};
