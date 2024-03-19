import { MAX_SUBMISSIONS_LIMIT } from "@hooks/useDeployContest";
import { CustomizationOptions, SubmissionType, SubmissionTypeOption } from "@hooks/useDeployContest/store";
import { Charge } from "@hooks/useDeployContest/types";
import moment from "moment";
import { Option } from "../components/DefaultDropdown";
import { CONTEST_TITLE_MAX_LENGTH, CONTEST_TYPE_MAX_LENGTH } from "../constants/length";

export type StateKey =
  | "title"
  | "prompt"
  | "type"
  | "summary"
  | "votingOpen"
  | "votingClose"
  | "submissionOpen"
  | "votingMerkle"
  | "submissionMerkle"
  | "submissionRequirements"
  | "charge"
  | "customization";

interface SpecialStepConditions {
  submissionMerkle: any;
  submissionRequirementsOption: Option;
  submissionTypeOption: SubmissionTypeOption;
  votingMerkle: any;
  votingRequirementsOption: Option;
  votingTab: number;
  submissionTab: number;
}

const titleValidation = (title: string) => {
  if (!title || title.length >= CONTEST_TITLE_MAX_LENGTH) {
    return "Contest title should be no more than 30 characters";
  }
  return "";
};

const summaryValidation = (summary: string) => {
  if (!summary || summary.length >= CONTEST_TITLE_MAX_LENGTH) {
    return "Contest summary should be no more than 30 characters";
  }
  return "";
};

const typeValidation = (type: string) => {
  if (!type || type.length >= CONTEST_TYPE_MAX_LENGTH) {
    return "tag should be no more than 20 characters";
  }
  return "";
};

const promptValidation = (prompt: { summarize: string; evaluateVoters: string }) => {
  let parser = new DOMParser();

  let docSummarize = parser.parseFromString(prompt.summarize, "text/html");
  if (!docSummarize.body.textContent?.trim()) {
    return "Contest summary shouldn't be empty";
  }

  let docEvaluateVoters = parser.parseFromString(prompt.evaluateVoters, "text/html");
  if (!docEvaluateVoters.body.textContent?.trim()) {
    return "Voter evaluation guidelines shouldn't be empty";
  }

  return "";
};

const votingOpenValidation = (votingOpen: string, submissionEnds: string) => {
  if (moment(votingOpen).isBefore(submissionEnds)) {
    return "Voting open date must be after the submission ends date";
  }
  return "";
};

const votingEndsValidation = (votingEnds: string, votingOpen: string, submissionEnds: string) => {
  if (moment(votingEnds).isBefore(votingOpen) || moment(votingEnds).isBefore(submissionEnds)) {
    return "Voting ends date must be after both the voting open date and the submission ends date";
  }
  return "";
};

const votingMerkleValidation = (allowList: Record<string, number>) => {
  if (!allowList || Object.keys(allowList).length === 0) {
    return "Merkle tree is empty";
  }

  return "";
};

const votingRequirementsValidation = (allowList: { records: Record<string, number>; type?: string }) => {
  if (allowList.type === "anyone") return "";

  if (!allowList || Object.keys(allowList.records).length === 0) {
    return "Merkle tree is empty";
  }
  return "";
};

const submissionMerkleValidation = (allowList: Record<string, number>) => {
  if (Object.keys(allowList).length === 0) {
    return "Merkle tree is empty";
  }
  return "";
};

const submissionRequirementsValidation = (submissionRequirements: string) => {
  if (!submissionRequirements) {
    return "Submission requirements should be a valid field";
  }
  return "";
};

const monetizationValidation = (charge: Charge) => {
  if (charge.error) return "Please enter a valid charge";

  return "";
};

const customizationValidation = (customization: CustomizationOptions) => {
  if (
    customization.allowedSubmissionsPerUser === 0 ||
    customization.maxSubmissions === 0 ||
    customization.maxSubmissions > MAX_SUBMISSIONS_LIMIT
  ) {
    return "Please enter a valid number";
  }

  return "";
};

export const validationFunctions = new Map<number, { validation: (...args: any[]) => string; stateKeys: StateKey[] }[]>(
  [
    [0, [{ validation: titleValidation, stateKeys: ["title"] }]],
    [1, [{ validation: promptValidation, stateKeys: ["prompt"] }]],
    [2, [{ validation: summaryValidation, stateKeys: ["summary"] }]],
    [3, [{ validation: typeValidation, stateKeys: ["type"] }]],
    [
      4,
      [
        { validation: votingOpenValidation, stateKeys: ["votingOpen", "submissionOpen"] },
        { validation: votingEndsValidation, stateKeys: ["votingClose", "votingOpen", "submissionOpen"] },
      ],
    ],
    [
      5,
      [
        { validation: submissionMerkleValidation, stateKeys: ["submissionMerkle"] },
        { validation: submissionRequirementsValidation, stateKeys: ["submissionRequirements"] },
      ],
    ],
    [
      6,
      [
        { validation: votingMerkleValidation, stateKeys: ["votingMerkle"] },
        {
          validation: votingRequirementsValidation,
          stateKeys: ["votingMerkle"],
        },
      ],
    ],
    [
      7,
      [
        {
          validation: monetizationValidation,
          stateKeys: ["charge"],
        },
      ],
    ],
    [
      8,
      [
        {
          validation: customizationValidation,
          stateKeys: ["customization"],
        },
      ],
    ],
  ],
);

// This function is only used when user clicks on a step in the stepper
export const validateStep = (step: number, state: any, specialStepConditions: SpecialStepConditions) => {
  const validationConfigs = validationFunctions.get(step);
  const submissionStep = step === 5;
  const votingStep = step === 6;

  if (!validationConfigs) return;

  if (submissionStep || votingStep) {
    const canProceed = handleSpecialStepConditions(step, specialStepConditions);

    if (!canProceed) {
      return "error in step 5 or 6";
    }
    return "";
  }

  for (const validationConfig of validationConfigs) {
    const { validation, stateKeys } = validationConfig;
    const stateValues = stateKeys.map(key => state[key as StateKey]);
    const errorMessage = validation(...stateValues);

    if (errorMessage) {
      return errorMessage;
    }
  }

  return "";
};

const handleSpecialStepConditions = (
  currentStep: number,
  {
    submissionTypeOption,
    submissionRequirementsOption,
    submissionTab,
    submissionMerkle,
    votingMerkle,
    votingRequirementsOption,
    votingTab,
  }: SpecialStepConditions,
) => {
  if (currentStep === 5) {
    if (
      submissionTypeOption.value === SubmissionType.SameAsVoters ||
      (submissionRequirementsOption.value === "anyone" && submissionTab === 0)
    ) {
      return true;
    }
    return Object.values(submissionMerkle).some(merkle => merkle !== null);
  }

  if (currentStep === 6) {
    if (votingRequirementsOption.value === "anyone" && votingTab === 0) {
      return true;
    }
    return Object.values(votingMerkle).some(merkle => merkle !== null);
  }

  return true;
};
