import { toastError } from "@components/UI/Toast";
import { getJkLabsSplitDestinationAddress } from "../database";
import { prepareConstructorArgs } from "../helpers/constructorArgs";

interface PrepareDeploymentDataParams {
  address: `0x${string}`;
  chain: { id: number; name?: string };
  combinedPrompt: string;
  chargeType: { costToPropose: number; costToVote: number };
  contestData: {
    title: string;
    contestType: any;
    submissionOpen: Date;
    votingOpen: Date;
    votingClose: Date;
    customization: any;
    advancedOptions: any;
    charge: any;
    priceCurve: any;
    metadataFields: any;
    entryPreviewConfig: any;
  };
}

export const preparePromptData = (
  prompt: {
    summarize: string;
    evaluateVoters: string;
    contactDetails?: string;
    imageUrl?: string;
  },
  contestType: string,
) => {
  return new URLSearchParams({
    type: contestType,
    summarize: prompt.summarize,
    evaluateVoters: prompt.evaluateVoters,
    contactDetails: prompt.contactDetails ?? "",
    imageUrl: prompt.imageUrl ?? "",
  }).toString();
};

export const fetchJkLabsSplitDestination = async (
  chainId: number,
  chargeType: { costToPropose: number; costToVote: number },
) => {
  try {
    return await getJkLabsSplitDestinationAddress(chainId, {
      costToPropose: chargeType.costToPropose,
      costToVote: chargeType.costToVote,
    });
  } catch (error) {
    toastError({
      message: "Failed to fetch JK Labs split destination. Please try again later.",
    });
    throw error;
  }
};

export const prepareDeploymentData = async (params: PrepareDeploymentDataParams) => {
  const { address, chain, combinedPrompt, chargeType, contestData } = params;

  const jkLabsSplitDestination = await fetchJkLabsSplitDestination(chain.id, chargeType);

  const constructorArgs = prepareConstructorArgs({
    title: contestData.title,
    combinedPrompt,
    contestType: contestData.contestType,
    submissionOpen: contestData.submissionOpen,
    votingOpen: contestData.votingOpen,
    votingClose: contestData.votingClose,
    customization: contestData.customization,
    advancedOptions: contestData.advancedOptions,
    charge: contestData.charge,
    priceCurve: contestData.priceCurve,
    metadataFields: contestData.metadataFields,
    entryPreviewConfig: contestData.entryPreviewConfig,
    clientAccountAddress: address,
    jkLabsSplitDestination,
  });

  return {
    address,
    chain,
    combinedPrompt,
    chargeType,
    jkLabsSplitDestination,
    constructorArgs,
  };
};
