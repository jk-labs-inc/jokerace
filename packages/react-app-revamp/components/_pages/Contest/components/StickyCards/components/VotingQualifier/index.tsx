import { useContestStore } from "@hooks/useContest/store";
import { useShallow } from "zustand/react/shallow";
import VotingQualifierAllowlisted from "./components/Allowlisted";
import VotingQualifierAnyoneCanVote from "./components/AnyoneCanVote";

const VotingContestQualifier = () => {
  const anyoneCanVote = useContestStore(useShallow(state => state.anyoneCanVote));

  return (
    <div className="w-full flex flex-col gap-2 md:gap-4 md:pl-8">
      {anyoneCanVote ? <VotingQualifierAnyoneCanVote /> : <VotingQualifierAllowlisted />}
    </div>
  );
};

export default VotingContestQualifier;
