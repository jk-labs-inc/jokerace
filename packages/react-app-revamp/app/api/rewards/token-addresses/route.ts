import { createSupabaseClient } from "@config/supabase";
import { isSupabaseConfigured } from "@helpers/database";
import { NextRequest, NextResponse } from "next/server";

export const fetchCache = "force-no-store";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const rewardsModuleAddress = searchParams.get("rewardsModuleAddress");
  const networkName = searchParams.get("networkName");

  if (!rewardsModuleAddress || !networkName) {
    return NextResponse.json({ error: "invalid parameters" }, { status: 400 });
  }

  if (isSupabaseConfigured(SUPABASE_URL, SUPABASE_ANON_KEY)) {
    const supabase = createSupabaseClient(SUPABASE_URL as string, SUPABASE_ANON_KEY as string);

    const { data: tokens, error } = await supabase
      .from("analytics_rewards_v3")
      .select("token_address")
      .eq("rewards_module_address", rewardsModuleAddress)
      .eq("network_name", networkName.toLowerCase())
      .not("token_address", "is", null);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const uniqueTokens = new Set(
      tokens
        .map((token: { token_address: string }) => token.token_address)
        .filter((address: string) => address !== "native"),
    );

    return NextResponse.json(Array.from(uniqueTokens));
  }

  return NextResponse.json([]);
}
