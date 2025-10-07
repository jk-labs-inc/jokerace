export enum ProposalState {
  Deleted = "This entry has been deleted by the creator.",
}

export interface ProposalStaticData {
  description: string;
  author: string;
  exists: boolean;
  fieldsMetadata: {
    addressArray: string[];
    stringArray: string[];
    uintArray: bigint[];
  };
  isDeleted: boolean;
}

export interface ContestVoteTimings {
  voteStart: bigint;
  contestDeadline: bigint;
}
