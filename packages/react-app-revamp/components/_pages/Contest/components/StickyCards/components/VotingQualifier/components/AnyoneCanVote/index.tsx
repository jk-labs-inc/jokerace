import { useContestStore } from "@hooks/useContest/store";
import { compareVersions } from "compare-versions";
import { FC } from "react";
import { useShallow } from "zustand/shallow";
import VotingQualifierAnyoneCanVoteCurve from "./components/Curve";
import VotingQualifierAnyoneCanVoteFlat from "./components/Flat";
import { VOTING_PRICE_CURVES_VERSION } from "constants/versions";

interface VotingQualifierAnyoneCanVoteProps {
  votingTimeLeft: number;
}

const VotingQualifierAnyoneCanVote: FC<VotingQualifierAnyoneCanVoteProps> = ({ votingTimeLeft }) => {
  const version = useContestStore(useShallow(state => state.version));

  if (compareVersions(version, VOTING_PRICE_CURVES_VERSION) < 0) {
    return <VotingQualifierAnyoneCanVoteFlat />;
  }

  return <VotingQualifierAnyoneCanVoteCurve votingTimeLeft={votingTimeLeft} />;
};

export default VotingQualifierAnyoneCanVote;
