import { MAX_SUBMISSIONS_LIMIT } from "@hooks/useDeployContest";
import { CustomizationOptions } from "@hooks/useDeployContest/store";
import { Charge } from "@hooks/useDeployContest/types";
import moment from "moment";
import { CONTEST_TITLE_MAX_LENGTH, CONTEST_TYPE_MAX_LENGTH } from "../constants/length";

export type StateKey =
  | "title"
  | "prompt"
  | "summary"
  | "type"
  | "votingOpen"
  | "votingClose"
  | "submissionOpen"
  | "votingMerkle"
  | "submissionMerkle"
  | "submissionRequirements"
  | "charge"
  | "customization";

const titleValidation = (title: string) => {
  if (!title || title.length > CONTEST_TITLE_MAX_LENGTH) {
    return "Contest title should be no more than 30 characters";
  }
  return "";
};

const summaryValidation = (summary: string) => {
  if (!summary || summary.length > CONTEST_TITLE_MAX_LENGTH) {
    return "Contest summary should be no more than 30 characters";
  }
  return "";
};

const typeValidation = (type: string) => {
  if (!type || type.length > CONTEST_TYPE_MAX_LENGTH) {
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

const validationMap: Record<StateKey, (...args: any[]) => string> = {
  title: titleValidation,
  prompt: promptValidation,
  summary: summaryValidation,
  type: typeValidation,
  votingOpen: votingOpenValidation,
  votingClose: votingEndsValidation,
  submissionOpen: votingOpenValidation,
  votingMerkle: votingMerkleValidation,
  submissionMerkle: submissionMerkleValidation,
  submissionRequirements: submissionRequirementsValidation,
  charge: monetizationValidation,
  customization: customizationValidation,
};

export const validateField = (key: StateKey, state: any): string => {
  const validationFunction = validationMap[key];
  if (!validationFunction) return "";

  switch (key) {
    case "title":
      return validationFunction(state.title);
    case "prompt":
      return validationFunction(state.prompt);
    case "summary":
      return validationFunction(state.summary);
    case "type":
      return validationFunction(state.type);
    case "submissionOpen":
      return validationFunction(state.votingOpen, state.submissionOpen);
    case "votingOpen":
      return validationFunction(state.votingOpen, state.submissionOpen);
    case "votingClose":
      return validationFunction(state.votingClose, state.votingOpen, state.submissionOpen);
    case "votingMerkle":
    case "submissionMerkle":
      return validationFunction(state[key]);
    case "submissionRequirements":
      return validationFunction(state.submissionRequirements);
    case "charge":
      return validationFunction(state.charge);
    case "customization":
      return validationFunction(state.customization);

    default:
      return validationFunction(state[key]);
  }
};
