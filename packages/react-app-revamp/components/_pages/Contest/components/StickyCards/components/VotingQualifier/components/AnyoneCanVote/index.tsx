import useContestConfigStore from "@hooks/useContestConfig/store";
import { compareVersions } from "compare-versions";
import { VOTING_PRICE_CURVES_VERSION } from "constants/versions";
import { FC } from "react";
import { useShallow } from "zustand/shallow";
import VotingQualifierAnyoneCanVoteCurve from "./components/Curve";
import VotingQualifierAnyoneCanVoteFlat from "./components/Flat";

interface VotingQualifierAnyoneCanVoteProps {
  votingTimeLeft: number;
}

const VotingQualifierAnyoneCanVote: FC<VotingQualifierAnyoneCanVoteProps> = ({ votingTimeLeft }) => {
  const version = useContestConfigStore(useShallow(state => state.contestConfig.version));

  if (compareVersions(version, VOTING_PRICE_CURVES_VERSION) < 0) {
    return <VotingQualifierAnyoneCanVoteFlat />;
  }

  return <VotingQualifierAnyoneCanVoteCurve votingTimeLeft={votingTimeLeft} />;
};

export default VotingQualifierAnyoneCanVote;
