import { NextRequest, NextResponse } from "next/server";
import { isSupabaseConfigured } from "@helpers/database";
import { ContestValues } from "@hooks/useContestsIndexV3";
import { createSupabaseClient } from "@config/supabase";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured(SUPABASE_URL, SUPABASE_ANON_KEY)) {
    return NextResponse.json({ error: "Supabase is not configured" }, { status: 500 });
  }

  try {
    const values: ContestValues = await request.json();

    const supabase = createSupabaseClient(SUPABASE_URL as string, SUPABASE_ANON_KEY as string);

    const { error, data } = await supabase.from("contests_v3").insert([
      {
        created_at: new Date().toISOString(),
        start_at: values.datetimeOpeningSubmissions,
        vote_start_at: values.datetimeOpeningVoting,
        end_at: values.datetimeClosingVoting,
        title: values.title,
        type: values.type,
        summary: values.summary,
        prompt: values.prompt,
        address: values.contractAddress,
        votingMerkleRoot: values.votingMerkleRoot,
        submissionMerkleRoot: values.submissionMerkleRoot,
        author_address: values.authorAddress,
        network_name: values.networkName,
        featured: values.featured ?? false,
        voting_requirements: values.voting_requirements,
        submission_requirements: values.submission_requirements,
        cost_to_propose: values.cost_to_propose,
        cost_to_vote: values.cost_to_vote,
        percentage_to_creator: values.percentage_to_creator,
        hidden: values.hidden,
      },
    ]);

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("Error indexing contest:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
