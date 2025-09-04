import { ContestType } from "@components/_pages/Create/types";

export interface ContestDataParams {
  constructorArgs: {
    intConstructorArgs: {
      anyoneCanSubmit: number;
    };
  };
  title: string;
  contestType: ContestType;
  combinedPrompt: string;
  submissionOpen: Date;
  votingOpen: Date;
  votingClose: Date;
  contractAddress: string;
  address: string;
  chainName?: string;
  chargeType: {
    costToPropose: number;
    costToVote: number;
  };
  charge: {
    percentageToCreator: number;
  };
}

export interface ContestData {
  anyoneCanSubmit: number;
  title: string;
  type: ContestType;
  prompt: string;
  datetimeOpeningSubmissions: Date;
  datetimeOpeningVoting: Date;
  datetimeClosingVoting: Date;
  contractAddress: string;
  votingMerkleRoot: null;
  submissionMerkleRoot: null;
  authorAddress: string;
  networkName: string;
  voting_requirements: null;
  cost_to_propose: number;
  cost_to_vote: number;
  percentage_to_creator: number;
}

export const prepareContestData = (params: ContestDataParams): ContestData => {
  const {
    constructorArgs,
    title,
    contestType,
    combinedPrompt,
    submissionOpen,
    votingOpen,
    votingClose,
    contractAddress,
    address,
    chainName,
    chargeType,
    charge,
  } = params;

  return {
    anyoneCanSubmit: constructorArgs.intConstructorArgs.anyoneCanSubmit,
    title: title,
    type: contestType,
    prompt: combinedPrompt,
    datetimeOpeningSubmissions: submissionOpen,
    datetimeOpeningVoting: votingOpen,
    datetimeClosingVoting: votingClose,
    contractAddress: contractAddress.toLowerCase(),
    votingMerkleRoot: null,
    submissionMerkleRoot: null,
    authorAddress: address,
    networkName: chainName?.toLowerCase().replace(" ", "") ?? "",
    voting_requirements: null,
    cost_to_propose: chargeType.costToPropose,
    cost_to_vote: chargeType.costToVote,
    percentage_to_creator: charge.percentageToCreator,
  };
};
