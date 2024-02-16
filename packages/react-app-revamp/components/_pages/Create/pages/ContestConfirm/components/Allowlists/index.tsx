import {
  SubmissionMerkle,
  SubmissionRequirements,
  VotingMerkle,
  VotingRequirements,
} from "@hooks/useDeployContest/types";
import { FC, useState } from "react";
import { Steps } from "../..";
import CreateContestConfirmLayout from "../Layout";
import { SubmissionType, SubmissionTypeOption } from "@hooks/useDeployContest/store";

type SubmissionMerkleAllowlists = {
  manual: SubmissionMerkle | null;
  csv: SubmissionMerkle | null;
  prefilled: SubmissionMerkle | null;
};

type VotingMerkleAllowlists = {
  manual: VotingMerkle | null;
  csv: VotingMerkle | null;
  prefilled: VotingMerkle | null;
};

interface CreateContestConfirmAllowlistsProps {
  allowlists: {
    submissionMerkle: SubmissionMerkleAllowlists;
    votingMerkle: VotingMerkleAllowlists;
    submissionRequirements: SubmissionRequirements;
    votingRequirements: VotingRequirements;
    submissionTypeOption: SubmissionTypeOption;
  };
  step: Steps;
  onClick?: (step: Steps) => void;
}

const CreateContestConfirmAllowlists: FC<CreateContestConfirmAllowlistsProps> = ({ allowlists, step, onClick }) => {
  const { submissionMerkle, votingMerkle, submissionRequirements, votingRequirements, submissionTypeOption } =
    allowlists;
  const isSubmissionMerklePrefilled = submissionMerkle.prefilled;
  const isVotingMerklePrefilled = votingMerkle.prefilled;
  const anyoneCanSubmit = !submissionMerkle.csv && !submissionMerkle.manual && !submissionMerkle.prefilled;
  const submittersAsVoters = submissionTypeOption.value === SubmissionType.SameAsVoters;
  const [isHovered, setIsHovered] = useState(false);

  if (!isSubmissionMerklePrefilled && !isVotingMerklePrefilled) {
    return (
      <CreateContestConfirmLayout onClick={() => onClick?.(step)} onHover={value => setIsHovered(value)}>
        <div
          className={`flex flex-col gap-4 ${
            isHovered ? "text-neutral-11" : "text-neutral-14"
          } transition-colors duration-300`}
        >
          <p className="text-[16px] font-bold">allowlists:</p>
          <ul className="flex flex-col pl-8">
            <li className="text-[16px] list-disc">
              {anyoneCanSubmit
                ? "anyone can submit"
                : submittersAsVoters
                ? "submitters allowlist is same as voters"
                : "custom allowlist for submitters"}
            </li>
            <li className="text-[16px] list-disc">custom allowlist for voters</li>
          </ul>
        </div>
      </CreateContestConfirmLayout>
    );
  }

  return (
    <CreateContestConfirmLayout>
      <div></div>
    </CreateContestConfirmLayout>
  );
};

export default CreateContestConfirmAllowlists;
