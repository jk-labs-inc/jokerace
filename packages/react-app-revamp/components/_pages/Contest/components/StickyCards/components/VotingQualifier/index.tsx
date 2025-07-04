import { useContestStore } from "@hooks/useContest/store";
import { FC } from "react";
import { useShallow } from "zustand/react/shallow";
import VotingQualifierAllowlisted from "./components/Allowlisted";
import VotingQualifierAnyoneCanVote from "./components/AnyoneCanVote";

interface VotingContestQualifierProps {
  votingTimeLeft: number;
}

const VotingContestQualifier: FC<VotingContestQualifierProps> = ({ votingTimeLeft }) => {
  const anyoneCanVote = useContestStore(useShallow(state => state.anyoneCanVote));

  return (
    <div className="w-full flex flex-col gap-2 md:gap-4 md:pl-4">
      {anyoneCanVote ? <VotingQualifierAnyoneCanVote votingTimeLeft={votingTimeLeft} /> : <VotingQualifierAllowlisted />}
    </div>
  );
};

export default VotingContestQualifier;
