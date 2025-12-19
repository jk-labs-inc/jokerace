import { FC } from "react";
import VotingQualifierAnyoneCanVoteCurve from "./components/Curve";

interface VotingQualifierAnyoneCanVoteProps {
  votingTimeLeft: number;
}

const VotingQualifierAnyoneCanVote: FC<VotingQualifierAnyoneCanVoteProps> = ({ votingTimeLeft }) => {
  return <VotingQualifierAnyoneCanVoteCurve votingTimeLeft={votingTimeLeft} />;
};

export default VotingQualifierAnyoneCanVote;
