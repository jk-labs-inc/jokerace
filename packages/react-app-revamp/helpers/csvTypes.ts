export type VotingInvalidEntry = {
  address: string;
  votes: number;
  error: "address" | "votes" | "both";
};

export type SubmissionInvalidEntry = {
  address: string;
  error: boolean;
};

export type CommonValidationError =
  | { kind: "missingColumns" }
  | { kind: "limitExceeded" }
  | { kind: "duplicates" }
  | { kind: "parseError"; error: Error };

export type UniqueVotingError = { kind: "allZero" };

export type VotingValidationError = CommonValidationError | UniqueVotingError;

export type SubmissionValidationError = CommonValidationError;
