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
  PROPOSER_HAS_ENS_REVERSE_RECORD_SET: "proposerHasEnsReverseRecordSet",
  PROPOSER_ENS_REVERSE_RECORD_IF_SET: "proposerEnsReverseRecordIfSet",
  VOTER_HAS_ENS_REVERSE_RECORD_SET: "voterHasEnsReverseRecordSet",
  VOTER_ENS_REVERSE_RECORD_IF_SET: "voterEnsReverseRecordIfSet",
};

export const CSV_COLUMNS_HEADERS = [
  { label: "Proposal id", key: HEADERS_KEYS.PROPOSAL_ID },
  { label: "Author", key: HEADERS_KEYS.AUTHOR },
  { label: "Proposal content", key: HEADERS_KEYS.PROPOSAL_CONTENT },
  { label: "Total votes", key: HEADERS_KEYS.TOTAL_VOTES },
  { label: "Voter", key: HEADERS_KEYS.VOTER },
  { label: "Votes", key: HEADERS_KEYS.VOTES },
  { label: "Percent of submission votes", key: HEADERS_KEYS.PERCENT_OF_SUBMISSION_VOTES },
  { label: "Proposer has ENS reverse record set", key: HEADERS_KEYS.PROPOSER_HAS_ENS_REVERSE_RECORD_SET },
  { label: "Proposer ENS reverse record if set", key: HEADERS_KEYS.PROPOSER_ENS_REVERSE_RECORD_IF_SET },
  { label: "Voter has ENS reverse record set", key: HEADERS_KEYS.VOTER_HAS_ENS_REVERSE_RECORD_SET },
  { label: "Voter ENS reverse record if set", key: "voterEnsReverseRecordIfSet" },
];
