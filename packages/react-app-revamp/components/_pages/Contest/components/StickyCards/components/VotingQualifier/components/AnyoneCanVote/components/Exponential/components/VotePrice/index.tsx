import { ContestStatus, useContestStatusStore } from "@hooks/useContestStatus/store";
import { FC } from "react";
import VotingQualifierAnyoneCanVoteExponentialEndPrice from "./components/EndPrice";
import VotingQualifierAnyoneCanVoteExponentialLivePrice from "./components/LivePrice";
import { useShallow } from "zustand/shallow";

const VotingQualifierAnyoneCanVoteExponentialVotePrice: FC = () => {
  const contestStatus = useContestStatusStore(useShallow(state => state.contestStatus));
  const isVotingOpen = contestStatus === ContestStatus.VotingOpen;

  if (!isVotingOpen) {
    return <VotingQualifierAnyoneCanVoteExponentialEndPrice />;
  }

  return <VotingQualifierAnyoneCanVoteExponentialLivePrice />;
};

export default VotingQualifierAnyoneCanVoteExponentialVotePrice;
