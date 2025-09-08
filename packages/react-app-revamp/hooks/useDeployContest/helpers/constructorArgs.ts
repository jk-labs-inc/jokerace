import { differenceInSeconds, getUnixTime } from "date-fns";
import { parseEther } from "viem";
import { createMetadataFieldsSchema } from "./index";
import { Charge, PriceCurveType, SplitFeeDestinationType } from "../types";
import { ContestType } from "@components/_pages/Create/types";
import { MAX_SUBMISSIONS_LIMIT, JK_LABS_SPLIT_DESTINATION_DEFAULT } from "../index";

export interface ConstructorArgsParams {
  title: string;
  combinedPrompt: string;
  contestType: ContestType;
  submissionOpen: Date;
  votingOpen: Date;
  votingClose: Date;
  customization: {
    allowedSubmissionsPerUser: number;
    maxSubmissions: number;
  };
  advancedOptions: {
    rankLimit: number;
  };
  charge: Charge;
  priceCurve: {
    type: PriceCurveType;
    multiple: number;
  };
  metadataFields: any;
  entryPreviewConfig: any;
  clientAccountAddress?: string;
  jkLabsSplitDestination: string;
}

export const prepareConstructorArgs = (params: ConstructorArgsParams) => {
  const {
    title,
    combinedPrompt,
    contestType,
    submissionOpen,
    votingOpen,
    votingClose,
    customization,
    advancedOptions,
    charge,
    priceCurve,
    metadataFields,
    entryPreviewConfig,
    clientAccountAddress,
    jkLabsSplitDestination,
  } = params;

  const isAnyoneCanSubmit = contestType === ContestType.AnyoneCanPlay ? 1 : 0;
  const { type: chargeType, percentageToCreator } = charge;
  const { allowedSubmissionsPerUser, maxSubmissions } = customization;

  // Handle allowedSubmissionsPerUser and maxSubmissions in case they are not set, they are zero, or we pass "infinity" to the contract
  const finalAllowedSubmissionsPerUser =
    !isNaN(allowedSubmissionsPerUser) && allowedSubmissionsPerUser > 0
      ? allowedSubmissionsPerUser
      : MAX_SUBMISSIONS_LIMIT;
  const finalMaxSubmissions = !isNaN(maxSubmissions) && maxSubmissions > 0 ? maxSubmissions : MAX_SUBMISSIONS_LIMIT;
  const costToVote =
    priceCurve.type === PriceCurveType.Flat ? chargeType.costToVote : chargeType.costToVoteStartPrice ?? 0;

  const intConstructorArgs = {
    anyoneCanSubmit: isAnyoneCanSubmit,
    contestStart: getUnixTime(submissionOpen),
    votingDelay: differenceInSeconds(votingOpen, submissionOpen),
    votingPeriod: differenceInSeconds(votingClose, votingOpen),
    numAllowedProposalSubmissions: finalAllowedSubmissionsPerUser,
    maxProposalCount: finalMaxSubmissions,
    sortingEnabled: 1,
    rankLimit: advancedOptions.rankLimit,
    percentageToCreator: percentageToCreator,
    costToPropose: parseEther(chargeType.costToPropose.toString()),
    costToVote: parseEther(costToVote.toString()),
    priceCurveType: priceCurve.type === PriceCurveType.Flat ? 0 : 1,
    multiple: priceCurve.type === PriceCurveType.Flat ? 1 : parseEther(priceCurve.multiple.toString()),
  };

  const constructorArgs = {
    name: title,
    prompt: combinedPrompt,
    intConstructorArgs,
    creatorSplitDestination:
      charge.splitFeeDestination.type === SplitFeeDestinationType.CreatorWallet
        ? clientAccountAddress
        : charge.splitFeeDestination.type === SplitFeeDestinationType.NoSplit
        ? jkLabsSplitDestination || JK_LABS_SPLIT_DESTINATION_DEFAULT
        : charge.splitFeeDestination.address,
    jkLabsSplitDestination: jkLabsSplitDestination || JK_LABS_SPLIT_DESTINATION_DEFAULT,
    metadataFieldsSchema: createMetadataFieldsSchema(metadataFields, entryPreviewConfig),
  };

  return constructorArgs;
};
