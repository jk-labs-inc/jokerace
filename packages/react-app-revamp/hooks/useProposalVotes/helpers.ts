import { MappedProposal } from "./types";

export const assignRankAndCheckTies = (mappedProposals: MappedProposal[], targetId: string) => {
  const sortedProposals = [...mappedProposals].sort((a, b) => b.votes - a.votes);

  let currentRank = 0;
  let lastVotes: number | null = null;
  const ranks: { [key: string]: number } = {};
  const votes: { [key: string]: number } = {};
  const hasAnyVotes = sortedProposals.some(p => p.votes > 0);

  sortedProposals.forEach(proposal => {
    if (proposal.votes !== lastVotes) {
      currentRank++;
      lastVotes = proposal.votes;
    }
    // If proposal has 0 votes but other proposals have votes, assign rank
    // Otherwise, if no proposals have votes, rank is 0
    ranks[proposal.id] = proposal.votes > 0 || hasAnyVotes ? currentRank : 0;
    votes[proposal.id] = proposal.votes;
  });

  const rank = ranks[targetId] || 0;
  const targetVotes = votes[targetId] || 0;

  // Only show tied if: rank > 0, has votes, and multiple entries share the rank with votes
  const entriesWithSameRank = sortedProposals.filter(p => ranks[p.id] === rank && p.votes > 0);
  const isTied = rank > 0 && targetVotes > 0 && entriesWithSameRank.length > 1;

  return { rank, isTied };
};
