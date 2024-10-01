import { createSupabaseClient } from "@config/supabase";
import { isSupabaseConfigured } from "@helpers/database";
import { NextRequest, NextResponse } from "next/server";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

export async function GET(request: NextRequest) {
  if (!isSupabaseConfigured(SUPABASE_URL as string, SUPABASE_ANON_KEY as string)) {
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
    const supabase = createSupabaseClient(SUPABASE_URL as string, SUPABASE_ANON_KEY as string);

    const { data, error } = await supabase
      .from("contest_participants_v3")
      .select("can_submit")
      .eq("user_address", userAddress)
      .eq("contest_address", contestAddress.toLowerCase())
      .eq("network_name", chainName.toLowerCase());

    if (error) {
      throw error;
    }

    return NextResponse.json({ data });
  } catch (error: any) {
    console.error("Error checking if user is allowed to submit:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
