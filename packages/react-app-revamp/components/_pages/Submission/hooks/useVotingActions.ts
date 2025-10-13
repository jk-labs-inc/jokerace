import useCastVotes from "@hooks/useCastVotes";
import { useCastVotesStore } from "@hooks/useCastVotes/store";
import { Charge } from "@hooks/useDeployContest/types";
import useContestConfigStore from "@hooks/useContestConfig/store";
import useProposalIdStore from "@hooks/useProposalId/store";
import { useProposalVoters } from "@hooks/useProposalVoters";
import useProposalVotes from "@hooks/useProposalVotes";
import { useEffect } from "react";
import { useShallow } from "zustand/shallow";

const REFETCH_DELAY_MS = 1000;

interface UseVotingActionsParams {
  charge: Charge;
  votesClose: Date;
}

export const useVotingActions = ({ charge, votesClose }: UseVotingActionsParams) => {
  const contestConfig = useContestConfigStore(useShallow(state => state.contestConfig));
  const proposalId = useProposalIdStore(useShallow(state => state.proposalId));
  const { isLoading, isSuccess } = useCastVotesStore(state => state);
  const { castVotes } = useCastVotes({ charge, votesClose });
  const { refetch: refetchProposalVotes } = useProposalVotes({
    contestAddress: contestConfig.address,
    proposalId: proposalId,
    chainId: contestConfig.chainId,
    abi: contestConfig.abi,
    version: contestConfig.version,
  });
  const { refetch: refetchProposalVoters } = useProposalVoters(
    contestConfig.address,
    proposalId,
    contestConfig.chainId,
  );

  useEffect(() => {
    if (isLoading || !isSuccess) return;

    const refetchWithDelay = async () => {
      await new Promise(resolve => setTimeout(resolve, REFETCH_DELAY_MS));
      refetchProposalVotes();
      refetchProposalVoters();
    };

    refetchWithDelay();
  }, [isSuccess, isLoading]);

  return {
    castVotes,
    isLoading,
  };
};
