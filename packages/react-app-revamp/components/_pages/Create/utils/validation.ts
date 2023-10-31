import moment from "moment";
import { CONTEST_TITLE_MAX_LENGTH, CONTEST_TYPE_MAX_LENGTH } from "../constants/length";

export type StateKey =
  | "type"
  | "title"
  | "summary"
  | "prompt"
  | "votingOpen"
  | "votingClose"
  | "submissionOpen"
  | "votingMerkle"
  | "submissionMerkle"
  | "submissionRequirements";

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

const votingRequirementsValidation = (allowList: Record<string, number>) => {
  if (!allowList || Object.keys(allowList).length === 0) {
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

export const validationFunctions = new Map<number, { validation: (...args: any[]) => string; stateKeys: StateKey[] }[]>(
  [
    [0, [{ validation: typeValidation, stateKeys: ["type"] }]],
    [1, [{ validation: titleValidation, stateKeys: ["title"] }]],
    [2, [{ validation: summaryValidation, stateKeys: ["summary"] }]],
    [3, [{ validation: promptValidation, stateKeys: ["prompt"] }]],
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
        { validation: votingMerkleValidation, stateKeys: ["votingMerkle"] },
        {
          validation: votingRequirementsValidation,
          stateKeys: ["votingMerkle"],
        },
      ],
    ],
    [
      6,
      [
        { validation: submissionMerkleValidation, stateKeys: ["submissionMerkle"] },
        { validation: submissionRequirementsValidation, stateKeys: ["submissionRequirements"] },
      ],
    ],
  ],
);

export const validateStep = (step: number, state: any) => {
  const validationConfigs = validationFunctions.get(step);

  if (!validationConfigs) return;

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
