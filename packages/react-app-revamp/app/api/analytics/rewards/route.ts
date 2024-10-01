import { createSupabaseClient } from "@config/supabase";
import { isSupabaseConfigured } from "@helpers/database";
import { NextRequest, NextResponse } from "next/server";

type RewardOperation = "deposit" | "distribute" | "withdraw";

interface RewardAnalyticsUpdateOptions {
  contest_address: string;
  rewards_module_address: string;
  network_name: string;
  amount: number;
  operation: RewardOperation;
  token_address: string | null;
  created_at?: number;
}

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured(SUPABASE_URL, SUPABASE_ANON_KEY)) {
    return NextResponse.json({ error: "Supabase is not configured" }, { status: 500 });
  }

  try {
    const options: RewardAnalyticsUpdateOptions = await request.json();
    const { contest_address, rewards_module_address, network_name, token_address, amount, operation, created_at } =
      options;

    const supabase = createSupabaseClient(SUPABASE_URL as string, SUPABASE_ANON_KEY as string);

    const insertPayload = {
      contest_address: contest_address.toLowerCase(),
      rewards_module_address,
      network_name,
      token_address: token_address ? token_address.toLowerCase() : null,
      amount_paid_in: operation === "deposit" ? amount : null,
      amount_paid_out: operation === "distribute" ? amount : null,
      amount_withdrawn: operation === "withdraw" ? amount : null,
      created_at,
    };

    const { error: insertError } = await supabase.from("analytics_rewards_v3").insert(insertPayload);

    if (insertError) {
      throw new Error(insertError.message);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating reward analytics:", error);
    return NextResponse.json({ error: "Failed to update reward analytics" }, { status: 500 });
  }
}
