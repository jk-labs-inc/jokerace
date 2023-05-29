import { ethers } from "ethers";
import { Submitter } from "lib/merkletree/generateSubmissionsTree";
import { Voter } from "lib/merkletree/generateVotersTree";

export function useContestParticipantsIndexV3() {
  const indexContestParticipantsV3 = async (address: string, voters: Voter[], submitters: Submitter[]) => {
    try {
      const config = await import("@config/supabase");
      const supabase = config.supabase;

      const voterSet = new Set(voters.map(voter => voter.address));
      const submitterSet = new Set(submitters.map(submitter => submitter.address));

      // Combine voters and submitters, removing duplicates
      const allParticipants = Array.from(
        new Set([...voters.map(voter => voter.address), ...submitters.map(submitter => submitter.address)]),
      );

      const everyoneCanSubmit = submitters.length === 0;

      const data = allParticipants.map(participant => {
        const isVoter = voterSet.has(participant);
        const isSubmitter = submitterSet.has(participant);

        let num_votes = 0;

        if (isVoter) {
          const voter = voters.find(v => v.address === participant);
          if (voter) {
            num_votes = parseFloat(ethers.utils.formatUnits(voter.numVotes, 18));
          }
        }

        return {
          contest_address: address,
          user_address: participant,
          // If everyone can submit or if this participant is a designated submitter, mark them as able to submit
          can_submit: everyoneCanSubmit || isSubmitter,
          num_votes: num_votes,
        };
      });

      const { error } = await supabase.from("contest_participants_v3").insert(data);

      if (error) {
        throw new Error(error.message);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return { indexContestParticipantsV3 };
}
