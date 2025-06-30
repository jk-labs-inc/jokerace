import { ContestStatus, useContestStatusStore } from "@hooks/useContestStatus/store";
import { FC } from "react";
import { useShallow } from "zustand/react/shallow";
import VotingQualifierAnyoneCanVoteExponentialEndPrice from "./components/EndPrice";
import VotingQualifierAnyoneCanVoteExponentialLivePrice from "./components/LivePrice";

interface VotingQualifierAnyoneCanVoteExponentialVotePriceProps {
  priceCurveUpdateInterval: number;
}

const VotingQualifierAnyoneCanVoteExponentialVotePrice: FC<VotingQualifierAnyoneCanVoteExponentialVotePriceProps> = ({
  priceCurveUpdateInterval,
}) => {
  const contestStatus = useContestStatusStore(useShallow(state => state.contestStatus));
  const isVotingOpen = contestStatus === ContestStatus.VotingOpen;

  if (!isVotingOpen) {
    return <VotingQualifierAnyoneCanVoteExponentialEndPrice />;
  }

  return <VotingQualifierAnyoneCanVoteExponentialLivePrice priceCurveUpdateInterval={priceCurveUpdateInterval} />;
};

export default VotingQualifierAnyoneCanVoteExponentialVotePrice;
