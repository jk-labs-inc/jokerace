import useContestVoteTimer from "@components/_pages/Submission/hooks/useContestVoteTimer";
import { useSubmissionPageStore } from "@components/_pages/Submission/store";
import useContestConfigStore from "@hooks/useContestConfig/store";
import useCurrentPricePerVote from "@hooks/useCurrentPricePerVote";
import { useShallow } from "zustand/shallow";

export const useVotingSetup = (votesClose: Date, userAddress?: string) => {
  const contestConfig = useContestConfigStore(useShallow(state => state.contestConfig));
  const { voteTimings, contestDetails } = useSubmissionPageStore(
    useShallow(state => ({
      voteTimings: state.voteTimings,
      contestDetails: state.contestDetails,
    })),
  );

  const { isVotingOpen } = useContestVoteTimer({
    voteStart: voteTimings?.voteStart ?? null,
    contestDeadline: voteTimings?.contestDeadline ?? null,
  });

  const { currentPricePerVote, currentPricePerVoteRaw } = useCurrentPricePerVote({
    address: contestConfig.address,
    abi: contestConfig.abi,
    chainId: contestConfig.chainId,
    votingClose: votesClose,
  });

  return {
    contestConfig,
    contestDetails,
    currentPricePerVote,
    currentPricePerVoteRaw,
    isVotingOpen,
  };
};
