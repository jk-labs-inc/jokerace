import { Charge } from "../types";

export interface ContestDataParams {
  title: string;
  combinedPrompt: string;
  submissionOpen: Date;
  votingOpen: Date;
  votingClose: Date;
  contractAddress: string;
  address: string;
  chainName?: string;
  charge: Charge;
  isAnyoneCanSubmit: boolean;
}

export interface ContestData {
  anyoneCanSubmit: number;
  title: string;
  prompt: string;
  datetimeOpeningSubmissions: Date;
  datetimeOpeningVoting: Date;
  datetimeClosingVoting: Date;
  contractAddress: string;
  authorAddress: string;
  networkName: string;
  cost_to_vote: number;
  percentage_to_creator: number;
}

export const prepareContestData = (params: ContestDataParams): ContestData => {
  const {
    title,
    isAnyoneCanSubmit,
    combinedPrompt,
    submissionOpen,
    votingOpen,
    votingClose,
    contractAddress,
    address,
    chainName,
    charge,
  } = params;

  return {
    anyoneCanSubmit: isAnyoneCanSubmit ? 1 : 0,
    title: title,
    prompt: combinedPrompt,
    datetimeOpeningSubmissions: submissionOpen,
    datetimeOpeningVoting: votingOpen,
    datetimeClosingVoting: votingClose,
    contractAddress: contractAddress.toLowerCase(),
    authorAddress: address,
    networkName: chainName?.toLowerCase().replace(" ", "") ?? "",
    cost_to_vote: charge.costToVote,
    percentage_to_creator: charge.percentageToCreator,
  };
};
