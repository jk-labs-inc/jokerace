import { NextRequest, NextResponse } from "next/server";
import { isSupabaseConfigured } from "@helpers/database";
import { createSupabaseClient } from "@config/supabase";

interface SaveToAnalyticsContestParticipantsOptions {
  contest_address: string;
  user_address: `0x${string}` | undefined;
  network_name: string;
  created_at?: number;
  proposal_id?: string;
  vote_amount?: number;
  deleted?: boolean;
  amount_sent?: number | null;
  percentage_to_creator?: number | null;
  comment_id?: string;
}

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured(SUPABASE_URL, SUPABASE_ANON_KEY)) {
    return NextResponse.json({ error: "Supabase is not configured" }, { status: 500 });
  }

  try {
    const options: SaveToAnalyticsContestParticipantsOptions = await request.json();

    const supabase = createSupabaseClient(SUPABASE_URL as string, SUPABASE_ANON_KEY as string);

    const { error } = await supabase.from("analytics_contest_participants_v3").insert(options);

    if (error) {
      console.error("Error in saveToAnalyticsContestParticipantsV3:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Unexpected error in saveToAnalyticsContestParticipantsV3:", e);
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
  }
}
