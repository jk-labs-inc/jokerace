import { VotingRequirements } from "@hooks/useDeployContest/types";
import { FC } from "react";
import { VotingMerkleAllowlists } from "../..";
import CreateContestConfirmVotersPrefilled from "./components/Prefilled";

interface CreateContestConfirmVotersProps {
  votingMerkle: VotingMerkleAllowlists;
  votingRequirements: VotingRequirements;
}

const CreateContestConfirmVoters: FC<CreateContestConfirmVotersProps> = ({ votingMerkle, votingRequirements }) => {
  const isVotingMerklePrefilled = votingMerkle.prefilled;

  if (!isVotingMerklePrefilled) {
    return <li className="text-[16px] list-disc">custom allowlist for voters</li>;
  }

  return <CreateContestConfirmVotersPrefilled votingRequirements={votingRequirements} />;
};

export default CreateContestConfirmVoters;
