export const HEADER_PROPOSAL_ID = "proposalId";
export const HEADER_AUTHOR = "author";
export const HEADER_PROPOSAL_CONTENT = "proposalContent";
export const HEADER_TOTAL_VOTES = "totalVotes";
export const HEADER_VOTER = "voter";
export const HEADER_VOTES = "votes";
export const HEADER_PERCENT = "votes";
export const HEADERS_KEYS = {
  PROPOSAL_ID: "proposalId",
  AUTHOR: "author",
  PROPOSAL_CONTENT: "proposalContent",
  TOTAL_VOTES: "totalVotes",
  VOTER: "voter",
  VOTES: "votes",
  PERCENT_OF_SUBMISSION_VOTES: "percentOfSubmissionVotes",
};

export const CSV_COLUMNS_HEADERS = [
  { label: "Proposal id", key: HEADERS_KEYS.PROPOSAL_ID },
  { label: "Author", key: HEADERS_KEYS.AUTHOR },
  { label: "Proposal content", key: HEADERS_KEYS.PROPOSAL_CONTENT },
  { label: "Total votes", key: HEADERS_KEYS.TOTAL_VOTES },
  { label: "Voter", key: HEADERS_KEYS.VOTER },
  { label: "Votes", key: HEADERS_KEYS.VOTES },
  { label: "Percent of submission votes", key: HEADERS_KEYS.PERCENT_OF_SUBMISSION_VOTES },
];
