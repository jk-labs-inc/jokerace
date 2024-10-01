import { createSupabaseClient } from "@config/supabase";
import { isSupabaseConfigured } from "@helpers/database";
import { ContestValues } from "@hooks/useContestsIndexV3";
import { SubmissionMerkle, VotingMerkle } from "@hooks/useDeployContest/types";
import { formatUnits } from "ethers/lib/utils";
import { NextRequest, NextResponse } from "next/server";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured(SUPABASE_URL, SUPABASE_ANON_KEY)) {
    return NextResponse.json({ error: "Supabase is not configured" }, { status: 500 });
  }

  try {
    const {
      contestData,
      votingMerkle,
      submissionMerkle,
    }: {
      contestData: ContestValues;
      votingMerkle: VotingMerkle;
      submissionMerkle: SubmissionMerkle | null;
    } = await request.json();

    const { networkName, contractAddress } = contestData;

    const submitters = submissionMerkle ? submissionMerkle.submitters : [];
    const voters = votingMerkle ? votingMerkle.voters : [];
    const submitterSet = new Set(submitters.map(submitter => submitter.address));
    const voterSet = new Set(voters.map(voter => voter.address));

    // Combine voters and submitters, removing duplicates
    const allParticipants = Array.from(
      new Set([...voters.map(voter => voter.address), ...submitters.map(submitter => submitter.address)]),
    );

    const everyoneCanSubmit = submitters.length === 0;

    const supabase = createSupabaseClient(SUPABASE_URL as string, SUPABASE_ANON_KEY as string);

    const votersMap = new Map(voters.map(voter => [voter.address, voter]));

    const data = allParticipants.map(participant => {
      const isVoter = voterSet.has(participant);
      const isSubmitter = everyoneCanSubmit ? everyoneCanSubmit : submitterSet.has(participant);

      let num_votes = 0;

      if (isVoter) {
        const voter = votersMap.get(participant);
        if (voter) {
          num_votes = parseFloat(formatUnits(voter.numVotes, 18));
        }
      }

      return {
        contest_address: contractAddress,
        user_address: participant,
        can_submit: isSubmitter,
        num_votes: num_votes,
        network_name: networkName,
      };
    });

    const { error } = await supabase.from("contest_participants_v3").insert(data);

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error indexing contest participants:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
