import { NextRequest, NextResponse } from "next/server";
import { isSupabaseConfigured } from "@helpers/database";

interface UpdatedCommentStatus {
  userAddress: string;
  contestAddress: string;
  chainName: string;
  proposal_id: string;
  comment_ids: string[];
}

export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured) {
    return NextResponse.json({ error: "Supabase is not configured" }, { status: 500 });
  }

  try {
    const { userAddress, contestAddress, chainName, proposal_id, comment_ids }: UpdatedCommentStatus =
      await request.json();

    const config = await import("@config/supabase");
    const supabase = config.supabase;

    const errors = [];

    for (let comment_id of comment_ids) {
      const { error } = await supabase.from("analytics_contest_participants_v3").insert([
        {
          user_address: userAddress,
          contest_address: contestAddress.toLowerCase(),
          network_name: chainName,
          proposal_id: proposal_id,
          comment_id: comment_id,
          deleted: true,
        },
      ]);

      if (error) {
        errors.push({ comment_id, error: error.message });
      }
    }

    if (errors.length > 0) {
      return NextResponse.json({ errors }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Unexpected error in saveUpdatedProposalsCommentStatusToAnalyticsV3:", e);
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
  }
}
