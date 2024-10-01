import { NextRequest, NextResponse } from "next/server";
import { isSupabaseConfigured } from "@helpers/database";

export async function GET(request: NextRequest) {
  if (!isSupabaseConfigured) {
    return NextResponse.json({ error: "Supabase is not configured" }, { status: 500 });
  }

  const searchParams = request.nextUrl.searchParams;
  const userAddress = searchParams.get("userAddress");
  const contestAddress = searchParams.get("contestAddress");
  const chainName = searchParams.get("chainName");

  if (!userAddress || !contestAddress || !chainName) {
    return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
  }

  try {
    const supabaseConfig = await import("@config/supabase");
    const supabase = supabaseConfig.supabase;

    const { data, error } = await supabase
      .from("contest_participants_v3")
      .select("num_votes")
      .eq("user_address", userAddress)
      .eq("contest_address", contestAddress.toLowerCase())
      .eq("network_name", chainName.toLowerCase());

    if (error) {
      throw error;
    }

    return NextResponse.json({ data });
  } catch (error: any) {
    console.error("Error fetching user vote info:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
