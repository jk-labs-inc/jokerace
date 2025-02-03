import { MAX_SUBMISSIONS_LIMIT } from "@hooks/useDeployContest";
import { CustomizationOptions } from "@hooks/useDeployContest/store";
import { Charge } from "@hooks/useDeployContest/types";
import moment from "moment";
import { CONTEST_TITLE_MAX_LENGTH } from "../constants/length";
import { ContestType } from "../types";

export type StateKey =
  | "contestType"
  | "title"
  | "prompt"
  | "entryPreviewConfig"
  | "votingOpen"
  | "votingClose"
  | "submissionOpen"
  | "votingMerkle"
  | "charge"
  | "customization";

const titleValidation = (title: string) => {
  if (!title || title.length > CONTEST_TITLE_MAX_LENGTH) {
    return "Contest title should be no more than 30 characters";
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

const entriesValidation = (entries: any) => {
  // we do not need to validate entries for now
  return "";
};

const contestTypeValidation = (contestType: ContestType) => {
  // we do not need to validate contest type for now
  return "";
};

const validationMap: Record<StateKey, (...args: any[]) => string> = {
  contestType: contestTypeValidation,

  title: titleValidation,
  prompt: promptValidation,
  entryPreviewConfig: entriesValidation,
  votingOpen: votingOpenValidation,
  votingClose: votingEndsValidation,
  submissionOpen: votingOpenValidation,
  votingMerkle: votingMerkleValidation,
  charge: monetizationValidation,
  customization: customizationValidation,
};

export const validateField = (key: StateKey, state: any): string => {
  const validationFunction = validationMap[key];
  if (!validationFunction) return "";

  switch (key) {
    case "contestType":
      return validationFunction(state.contestType);
    case "title":
      return validationFunction(state.title);
    case "prompt":
      return validationFunction(state.prompt);
    case "submissionOpen":
      return validationFunction(state.votingOpen, state.submissionOpen);
    case "votingOpen":
      return validationFunction(state.votingOpen, state.submissionOpen);
    case "votingClose":
      return validationFunction(state.votingClose, state.votingOpen, state.submissionOpen);
    case "votingMerkle":
      return validationFunction(state[key]);
    case "charge":
      return validationFunction(state.charge);
    case "customization":
      return validationFunction(state.customization);
    default:
      return validationFunction(state[key]);
  }
};
