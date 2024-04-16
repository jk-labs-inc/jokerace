export const shortenProposalId = (proposalId: string) => {
  if (!proposalId) return "";

  const front = proposalId.slice(0, 5);
  const mid = "...";
  const end = proposalId.slice(-4);
  const shortenedProposalId = front + mid + end;
  return shortenedProposalId;
};
