import { NextRequest, NextResponse } from "next/server";
import { isSupabaseConfigured } from "@helpers/database";

interface UpdatedProposalStatus {
  userAddress: string;
  contestAddress: string;
  chainName: string;
  proposal_ids: string[];
}

export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured) {
    return NextResponse.json({ error: "Supabase is not configured" }, { status: 500 });
  }

  try {
    const { userAddress, contestAddress, chainName, proposal_ids }: UpdatedProposalStatus = await request.json();

    const config = await import("@config/supabase");
    const supabase = config.supabase;

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
