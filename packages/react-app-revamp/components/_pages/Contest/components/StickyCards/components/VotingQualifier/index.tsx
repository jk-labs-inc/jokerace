import { FC } from "react";
import VotingQualifierAnyoneCanVote from "./components/AnyoneCanVote";

interface VotingContestQualifierProps {
  votingTimeLeft: number;
}

const VotingContestQualifier: FC<VotingContestQualifierProps> = ({ votingTimeLeft }) => {
  return (
    <div className="w-full flex flex-col gap-2 md:gap-4 md:pl-4">
      <VotingQualifierAnyoneCanVote votingTimeLeft={votingTimeLeft} />
    </div>
  );
};

export default VotingContestQualifier;
