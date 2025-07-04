import { ContestStatus, useContestStatusStore } from "@hooks/useContestStatus/store";
import { FC } from "react";
import { useShallow } from "zustand/react/shallow";
import VotingQualifierAnyoneCanVoteExponentialEndPrice from "./components/EndPrice";
import VotingQualifierAnyoneCanVoteExponentialLivePrice from "./components/LivePrice";

const VotingQualifierAnyoneCanVoteExponentialVotePrice: FC = () => {
  const contestStatus = useContestStatusStore(useShallow(state => state.contestStatus));
  const isVotingOpen = contestStatus === ContestStatus.VotingOpen;

  if (!isVotingOpen) {
    return <VotingQualifierAnyoneCanVoteExponentialEndPrice />;
  }

  return <VotingQualifierAnyoneCanVoteExponentialLivePrice />;
};

export default VotingQualifierAnyoneCanVoteExponentialVotePrice;
