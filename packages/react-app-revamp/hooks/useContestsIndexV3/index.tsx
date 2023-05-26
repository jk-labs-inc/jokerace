import { SubmissionMerkle, VotingMerkle } from "@hooks/useDeployContest/store";
import { getAccount } from "@wagmi/core";

interface ContestValues {
  datetimeOpeningSubmissions: Date;
  datetimeOpeningVoting: Date;
  datetimeClosingVoting: Date;
  title: string;
  info: string;
  contractAddress: string;
  authorAddress?: string;
  networkName: string;
  votingMerkleTree: VotingMerkle | null;
  submissionMerkleTree: SubmissionMerkle | null;
  featured?: boolean;
}

export function useV3ContestsIndex() {
  async function indexContestV3(values: ContestValues) {
    try {
      const { address } = getAccount();
      const config = await import("@config/supabase");
      const supabase = config.supabase;
      const { error, data } = await supabase.from("contests_v3").insert([
        {
          created_at: new Date().toISOString(),
          start_at: values.datetimeOpeningSubmissions.toISOString(),
          vote_start_at: values.datetimeOpeningVoting.toISOString(),
          end_at: values.datetimeClosingVoting.toISOString(),
          info: values.info,
          title: values.title,
          address: values.contractAddress,
          author_address: values?.authorAddress ?? address,
          network_name: values.networkName,
          votingMerkleTree: values.votingMerkleTree,
          submissionMerkleTree: values.submissionMerkleTree,
          featured: values.featured ?? false,
        },
      ]);
      if (error) {
        throw new Error(error.message);
      }
    } catch (e) {
      console.error(e);
    }
  }

  return {
    indexContestV3,
  };
}

export default useV3ContestsIndex;
