import { Voter } from "lib/merkletree/generateVotersTree";

export function useContestVotesIndexV3() {
  const indexContestVoteV3 = async (address: string, voters: Voter[]) => {
    try {
      const config = await import("@config/supabase");
      const supabase = config.supabase;

      const data = voters.map(voter => ({
        address: address,
        voter: voter.address,
        can_submit: true,
        num_votes: voter.numVotes,
      }));

      const { error } = await supabase.from("contest_voters_v3").insert(data);

      if (error) {
        throw new Error(error.message);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return { indexContestVoteV3 };
}
