import { useSubmissionPageStore } from "@components/_pages/Submission/store";
import { useVotingSetup } from "@components/_pages/Submission/hooks/useVotingSetup";
import useCharge from "@hooks/useCharge";
import useContestConfigStore from "@hooks/useContestConfig/store";
import { useShallow } from "zustand/shallow";

export const useVotingSetupMobile = () => {
  const contestConfig = useContestConfigStore(useShallow(state => state.contestConfig));
  const voteTimings = useSubmissionPageStore(useShallow(state => state.voteTimings));
  const { charge, isLoading: isChargeLoading } = useCharge({
    address: contestConfig.address,
    abi: contestConfig.abi,
    chainId: contestConfig.chainId,
  });

  const votesClose = new Date(Number(voteTimings?.contestDeadline) * 1000 + 1000);

  const votingSetup = useVotingSetup(votesClose);

  return {
    ...votingSetup,
    charge,
    isChargeLoading,
    votesClose,
  };
};
