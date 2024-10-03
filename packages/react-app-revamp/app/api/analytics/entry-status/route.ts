import { NextRequest, NextResponse } from "next/server";
import { isSupabaseConfigured } from "@helpers/database";
import { createSupabaseClient } from "@config/supabase";

interface UpdatedProposalStatus {
  userAddress: string;
  contestAddress: string;
  chainName: string;
  proposal_ids: string[];
}

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured(SUPABASE_URL, SUPABASE_ANON_KEY)) {
    return NextResponse.json({ error: "Supabase is not configured" }, { status: 500 });
  }

  try {
    const { userAddress, contestAddress, chainName, proposal_ids }: UpdatedProposalStatus = await request.json();

    const supabase = createSupabaseClient(SUPABASE_URL as string, SUPABASE_ANON_KEY as string);

    const errors = [];

    for (let proposal_id of proposal_ids) {
      const { error } = await supabase.from("analytics_contest_participants_v3").insert([
        {
          user_address: userAddress,
          contest_address: contestAddress.toLowerCase(),
          network_name: chainName,
          proposal_id: proposal_id,
          deleted: true,
        },
      ]);

      if (error) {
        errors.push({ proposal_id, error: error.message });
      }
    }

    if (errors.length > 0) {
      return NextResponse.json({ errors }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Unexpected error in saveUpdatedProposalsStatusToAnalyticsV3:", e);
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
  }
}
