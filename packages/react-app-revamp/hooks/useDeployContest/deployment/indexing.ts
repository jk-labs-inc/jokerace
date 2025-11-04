import { toastError } from "@components/UI/Toast";
import { indexContest } from "../database";
import { prepareContestData } from "../helpers/contestData";
import { prepareConstructorArgs } from "../helpers/constructorArgs";

interface PrepareContestDataParams {
  constructorArgs: ReturnType<typeof prepareConstructorArgs>;
  combinedPrompt: string;
  contractAddress: string;
  address: string;
  chainName?: string;
  chargeType: { costToPropose: number; costToVote: number };
  contestData: {
    title: string;
    contestType: any;
    submissionOpen: Date;
    votingOpen: Date;
    votingClose: Date;
    charge: any;
  };
}

export const prepareContestDataForIndexing = (params: PrepareContestDataParams) => {
  return prepareContestData({
    constructorArgs: params.constructorArgs,
    title: params.contestData.title,
    contestType: params.contestData.contestType,
    combinedPrompt: params.combinedPrompt,
    submissionOpen: params.contestData.submissionOpen,
    votingOpen: params.contestData.votingOpen,
    votingClose: params.contestData.votingClose,
    contractAddress: params.contractAddress,
    address: params.address,
    chainName: params.chainName,
    chargeType: params.chargeType,
    charge: params.contestData.charge,
  });
};

export const indexContestInDatabase = async (contestData: ReturnType<typeof prepareContestData>) => {
  try {
    await indexContest(contestData);
  } catch (error) {
    toastError({
      message: "contest deployment failed to index in db",
    });
    throw error;
  }
};
