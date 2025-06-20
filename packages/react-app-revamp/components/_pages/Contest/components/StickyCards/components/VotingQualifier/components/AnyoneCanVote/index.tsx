import { useContestStore } from "@hooks/useContest/store";
import { compareVersions } from "compare-versions";
import { useShallow } from "zustand/shallow";
import VotingQualifierAnyoneCanVoteCurve from "./components/Curve";
import VotingQualifierAnyoneCanVoteFlat from "./components/Flat";

const VotingQualifierAnyoneCanVote = () => {
  const version = useContestStore(useShallow(state => state.version));

  if (compareVersions(version, "5.7") < 0) {
    return <VotingQualifierAnyoneCanVoteFlat />;
  }

  return <VotingQualifierAnyoneCanVoteCurve />;
};

export default VotingQualifierAnyoneCanVote;
