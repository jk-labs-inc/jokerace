export interface ContestDataParams {
  title: string;
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
  cost_to_propose: number;
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
    chargeType,
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
    cost_to_propose: chargeType.costToPropose,
    cost_to_vote: chargeType.costToVote,
    percentage_to_creator: charge.percentageToCreator,
  };
};
