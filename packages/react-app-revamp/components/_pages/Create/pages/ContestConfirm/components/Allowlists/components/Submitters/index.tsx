import { SubmissionType, SubmissionTypeOption } from "@hooks/useDeployContest/store";
import { SubmissionRequirements } from "@hooks/useDeployContest/types";
import { SubmissionMerkleAllowlists } from "../..";
import { FC } from "react";
import CreateContestConfirmAlowlistsSubmittersPrefilled from "./components/Prefilled";
import { Option } from "@components/_pages/Create/components/TagDropdown";

interface CreateContestConfirmSubmittersProps {
  submissionMerkle: SubmissionMerkleAllowlists;
  submissionTypeOption: SubmissionTypeOption;
  submissionRequirements: SubmissionRequirements;
  submissionRequirementsOption: Option;
}

const CreateContestConfirmSubmitters: FC<CreateContestConfirmSubmittersProps> = ({
  submissionMerkle,
  submissionTypeOption,
  submissionRequirements,
  submissionRequirementsOption,
}) => {
  const anyoneCanSubmit = !submissionMerkle.csv && !submissionMerkle.manual && !submissionMerkle.prefilled;
  const submittersAsVoters = submissionTypeOption.value === SubmissionType.SameAsVoters;
  const isSubmissionMerklePrefilled = submissionMerkle.prefilled;

  if (anyoneCanSubmit) {
    return <li className="text-[16px] list-disc">anyone can submit</li>;
  }

  if (submittersAsVoters) {
    return <li className="text-[16px] list-disc">submitters allowlist is same as voters</li>;
  }

  if (!isSubmissionMerklePrefilled) {
    return <li className="text-[16px] list-disc">custom allowlist for submitters</li>;
  }

  if (submissionRequirementsOption.value === "creator") {
    return <li className="text-[16px] list-disc">only you can enter</li>;
  }

  return <CreateContestConfirmAlowlistsSubmittersPrefilled submissionRequirements={submissionRequirements} />;
};

export default CreateContestConfirmSubmitters;
