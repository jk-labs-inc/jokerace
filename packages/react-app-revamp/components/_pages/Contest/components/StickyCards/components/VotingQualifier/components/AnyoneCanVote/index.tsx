import { useContestStore } from "@hooks/useContest/store";
import { compareVersions } from "compare-versions";
import { FC } from "react";
import { useShallow } from "zustand/shallow";
import VotingQualifierAnyoneCanVoteCurve from "./components/Curve";
import VotingQualifierAnyoneCanVoteFlat from "./components/Flat";

interface VotingQualifierAnyoneCanVoteProps {
  votingTimeLeft: number;
}

const VotingQualifierAnyoneCanVote: FC<VotingQualifierAnyoneCanVoteProps> = ({ votingTimeLeft }) => {
  const version = useContestStore(useShallow(state => state.version));

  //TODO: add constant for this version
  if (compareVersions(version, "5.7") < 0) {
    return <VotingQualifierAnyoneCanVoteFlat />;
  }

  return <VotingQualifierAnyoneCanVoteCurve votingTimeLeft={votingTimeLeft} />;
};

export default VotingQualifierAnyoneCanVote;
