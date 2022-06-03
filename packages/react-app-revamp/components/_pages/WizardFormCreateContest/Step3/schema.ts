import { object, string, number, boolean, date } from "zod";

export interface DataStep3 {
  contestTitle: string;
  contestDescription: string;
  votingTokenAddress: string;
  datetimeOpeningSubmissions: string;
  submissionMaxNumber: number;
  submissionOpenToAll: boolean;
  requiredNumberOfTokensToSubmit: null | number;
  datetimeOpeningVoting: string;
  datetimeClosingVoting: string;
  usersCanVoteIfTheyHoldTokenOnVoteStart: boolean;
  usersCanVoteFromDatetime: string;
}

export const schema = object({
  contestTitle: string()
    .trim()
    .min(1),
  contestDescription: string()
    .trim()
    .min(1),
  votingTokenAddress: string().regex(/^0x[a-fA-F0-9]{40}$/),
  datetimeOpeningSubmissions: date(),
  submissionMaxNumber: number().positive(),
  submissionOpenToAll: boolean(),
  requiredNumberOfTokenToSubmit: number()
    .positive()
    .optional(),
  datetimeOpeningVoting: date(),
  datetimeClosingVoting: date(),
  usersCanVoteIfTheyHoldTokenOnVoteStart: boolean(),
  usersCanVoteFromDatetime: date().optional(),
});
