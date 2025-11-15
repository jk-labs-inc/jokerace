import { differenceInSeconds, getUnixTime } from "date-fns";
import { parseEther } from "viem";
import { JK_LABS_SPLIT_DESTINATION_DEFAULT, MAX_SUBMISSIONS_LIMIT } from "../index";
import { Charge, PriceCurveType } from "../types";
import { createMetadataFieldsSchema } from "./index";
import { EntryPreviewConfig, MetadataField } from "../slices/contestMetadataSlice";

export interface ConstructorArgsParams {
  title: string;
  combinedPrompt: string;
  submissionOpen: Date;
  votingOpen: Date;
  votingClose: Date;

  advancedOptions: {
    rankLimit: number;
  };
  charge: Charge;
  priceCurve: {
    type: PriceCurveType;
    multiple: number;
  };
  metadataFields: MetadataField[];
  entryPreviewConfig: EntryPreviewConfig;
  clientAccountAddress?: string;
  jkLabsSplitDestination: string;
}

export const prepareConstructorArgs = (params: ConstructorArgsParams) => {
  const {
    title,
    combinedPrompt,
    submissionOpen,
    votingOpen,
    votingClose,
    advancedOptions,
    charge,
    priceCurve,
    metadataFields,
    entryPreviewConfig,
    jkLabsSplitDestination,
  } = params;

  const { type: chargeType, percentageToCreator } = charge;

  const costToVote =
    priceCurve.type === PriceCurveType.Flat ? chargeType.costToVote : chargeType.costToVoteStartPrice ?? 0;

  const intConstructorArgs = {
    anyoneCanSubmit: entryPreviewConfig.isAnyoneCanSubmit ? 1 : 0,
    contestStart: getUnixTime(submissionOpen),
    votingDelay: differenceInSeconds(votingOpen, submissionOpen),
    votingPeriod: differenceInSeconds(votingClose, votingOpen),
    numAllowedProposalSubmissions: MAX_SUBMISSIONS_LIMIT,
    maxProposalCount: MAX_SUBMISSIONS_LIMIT,
    sortingEnabled: 1,
    rankLimit: advancedOptions.rankLimit,
    percentageToCreator: percentageToCreator,
    costToPropose: parseEther(chargeType.costToPropose.toString()),
    costToVote: parseEther(costToVote.toString()),
    priceCurveType: 1, // Exponential
    multiple: parseEther(priceCurve.multiple.toString()),
  };

  const constructorArgs = {
    name: title,
    prompt: combinedPrompt,
    intConstructorArgs,
    jkLabsSplitDestination: jkLabsSplitDestination || JK_LABS_SPLIT_DESTINATION_DEFAULT,
    metadataFieldsSchema: createMetadataFieldsSchema(metadataFields, entryPreviewConfig),
  };

  return constructorArgs;
};
