import { FC } from "react";
import VotingQualifierAnyoneCanVoteExponential from "../Exponential";

interface VotingQualifierAnyoneCanVoteCurveProps {
  votingTimeLeft: number;
}

const VotingQualifierAnyoneCanVoteCurve: FC<VotingQualifierAnyoneCanVoteCurveProps> = ({ votingTimeLeft }) => {
  return <VotingQualifierAnyoneCanVoteExponential votingTimeLeft={votingTimeLeft} />;
};

export default VotingQualifierAnyoneCanVoteCurve;
