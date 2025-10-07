import useContestVoteTimer from "@components/_pages/Submission/hooks/useContestVoteTimer";
import { useSubmissionPageStore } from "@components/_pages/Submission/store";
import useContestConfigStore from "@hooks/useContestConfig/store";
import useCurrentPricePerVoteWithRefetch from "@hooks/useCurrentPricePerVoteWithRefetch";
import useUser from "@hooks/useUser";
import { useUserStore } from "@hooks/useUser/store";
import { useEffect } from "react";
import { useShallow } from "zustand/shallow";

export const useVotingSetup = (votesClose: Date, userAddress?: string) => {
  const contestConfig = useContestConfigStore(useShallow(state => state.contestConfig));
  const { voteTimings, contestDetails } = useSubmissionPageStore(
    useShallow(state => ({
      voteTimings: state.voteTimings,
      contestDetails: state.contestDetails,
    })),
  );
  const currentUserAvailableVotesAmount = useUserStore(useShallow(state => state.currentUserAvailableVotesAmount));
  const { checkIfCurrentUserQualifyToVote } = useUser();

  const { isVotingOpen } = useContestVoteTimer({
    voteStart: voteTimings?.voteStart ?? null,
    contestDeadline: voteTimings?.contestDeadline ?? null,
  });

  const { currentPricePerVote } = useCurrentPricePerVoteWithRefetch({
    address: contestConfig.address,
    abi: contestConfig.abi,
    chainId: contestConfig.chainId,
    votingClose: votesClose,
  });

  useEffect(() => {
    if (!userAddress) return;

    checkIfCurrentUserQualifyToVote({
      address: contestConfig.address,
      abi: contestConfig.abi,
      chainId: contestConfig.chainId,
    });
  }, [userAddress, contestConfig.address, contestConfig.abi, contestConfig.chainId]);

  return {
    contestConfig,
    contestDetails,
    currentUserAvailableVotesAmount,
    currentPricePerVote,
    isVotingOpen,
  };
};
