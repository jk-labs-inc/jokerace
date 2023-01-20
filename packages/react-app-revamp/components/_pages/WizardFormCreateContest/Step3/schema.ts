import { object, string, number, boolean, array, any } from "zod";
import { isPast } from "date-fns";
export interface DataStep3 {
  contestTitle: string;
  contestDescription: string;
  votingTokenAddress: string;
  datetimeOpeningSubmissions: string;
  submissionMaxNumber: number;
  submissionOpenToAll: boolean;
  useSameTokenForSubmissions: boolean;
  submissionTokenAddress: string;
  requiredNumberOfTokensToSubmit: null | number;
  noSubmissionLimitPerUser: boolean;
  submissionPerUserMaxNumber: null | number;
  datetimeOpeningVoting: string;
  datetimeClosingVoting: string;
  usersQualifyToVoteIfTheyHoldTokenOnVoteStart: boolean;
  usersQualifyToVoteAtAnotherDatetime: string;
  downvoting: boolean;
  rewardsType: string;
  rewardTokenAddress: string;
  rewards: Array<any>;
}

export const schema = object({
  contestImageFile: any(),
  contestImageSrc: string().optional(),
  contestTitle: string()
    .trim()
    .min(1),
  contestDescription: string()
    .trim()
    .min(1),
  whoCanSubmit: string(),
  submissionTokenAddress: string()
    .regex(/^0x[a-fA-F0-9]{40}$/)
    .or(string().max(0)),
  votingTokenAddress: string().regex(/^0x[a-fA-F0-9]{40}$/),
  datetimeOpeningSubmissions: string(),
  submissionMaxNumber: number().positive(),
  submissionOpenToAll: boolean(),
  requiredNumberOfTokenToSubmit: number()
    .positive()
    .optional(),
  noSubmissionLimitPerUser: boolean(),
  submissionPerUserMaxNumber: number()
    .positive()
    .optional(),
  datetimeOpeningVoting: string().refine(value => value !== "" && !isPast(new Date(value))),
  datetimeClosingVoting: string().refine(value => value !== "" && !isPast(new Date(value))),
  usersQualifyToVoteIfTheyHoldTokenOnVoteStart: boolean(),
  usersQualifyToVoteAtAnotherDatetime: string().optional(),
  downvoting: boolean(),
  rewardsType: string(),
  rewardTokenAddress: string()
    .regex(/^0x[a-fA-F0-9]{40}$/)
    .optional()
    .or(string().max(0)),
  rewards: object({
    winningRank: number().positive(),
    rewardTokenAmount: number().positive(),
  })
    .array()
    .optional(),
});
