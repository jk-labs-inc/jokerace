export type VotingRequirementsSchema = {
  type: string;
  tokenAddress: string;
  chain: string;
  description: string;
  minTokensRequired: number;
  timestamp: number;
};

export type SubmissionRequirementsSchema = {
  type: string;
  chain: string;
  tokenAddress: string;
  minTokensRequired: number;
  timestamp: number;
};

export interface ContestValues {
  datetimeOpeningSubmissions: Date;
  datetimeOpeningVoting: Date;
  datetimeClosingVoting: Date;
  title: string;
  type: string;
  summary: string;
  prompt: string;
  contractAddress: string;
  networkName: string;
  votingMerkleRoot: string;
  submissionMerkleRoot: string;
  voting_requirements: VotingRequirementsSchema | null;
  submission_requirements: SubmissionRequirementsSchema | null;
  cost_to_propose: number;
  cost_to_vote: number;
  percentage_to_creator: number;
  hidden: boolean;
  authorAddress?: string;
  featured?: boolean;
}

export function useContestsIndexV3() {
  async function indexContestV3(values: ContestValues) {
    try {
      const response = await fetch("/api/contest/index-contest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to index contest: ${JSON.stringify(errorData)}`);
      }

      const result = await response.json();
      if (!result.success) {
        throw new Error("Failed to index contest");
      }

      return result.data;
    } catch (e) {
      throw e;
    }
  }

  return {
    indexContestV3,
  };
}

export default useContestsIndexV3;
