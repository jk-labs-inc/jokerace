import { toastError } from "@components/UI/Toast";
import { getJkLabsSplitDestinationAddress } from "../database";
import { prepareConstructorArgs } from "../helpers/constructorArgs";
import { AdvancedOptions } from "../slices/contestAdvancedOptionsSlice";
import { EntryPreviewConfig, MetadataField } from "../slices/contestMetadataSlice";
import { Charge, PriceCurve } from "../types";

interface PrepareDeploymentDataParams {
  address: `0x${string}`;
  chain: { id: number; name?: string };
  combinedPrompt: string;
  chargeType: { costToVote: number };
  contestData: {
    title: string;
    submissionOpen: Date;
    votingOpen: Date;
    votingClose: Date;
    advancedOptions: AdvancedOptions;
    charge: Charge;
    priceCurve: PriceCurve;
    metadataFields: MetadataField[];
    entryPreviewConfig: EntryPreviewConfig;
  };
}

export const preparePromptData = (prompt: {
  summarize: string;
  evaluateVoters: string;
  contactDetails?: string;
  imageUrl?: string;
}) => {
  return new URLSearchParams({
    summarize: prompt.summarize,
    evaluateVoters: prompt.evaluateVoters,
    contactDetails: prompt.contactDetails ?? "",
    imageUrl: prompt.imageUrl ?? "",
  }).toString();
};

export const fetchJkLabsSplitDestination = async (chainId: number, chargeType: { costToVote: number }) => {
  try {
    return await getJkLabsSplitDestinationAddress(chainId, {
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
    submissionOpen: contestData.submissionOpen,
    votingOpen: contestData.votingOpen,
    votingClose: contestData.votingClose,
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
