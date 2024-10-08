import { createSupabaseClient } from "@config/supabase";
import { isSupabaseConfigured } from "@helpers/database";
import { NextRequest, NextResponse } from "next/server";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

export async function GET(request: NextRequest) {
  if (!isSupabaseConfigured(SUPABASE_URL, SUPABASE_ANON_KEY)) {
    return NextResponse.json({ error: "Supabase is not configured" }, { status: 500 });
  }

  const searchParams = request.nextUrl.searchParams;
  const address = searchParams.get("address");
  const chainName = searchParams.get("chainName");

  if (!address || !chainName) {
    return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
  }

  try {
    const supabase = createSupabaseClient(SUPABASE_URL as string, SUPABASE_ANON_KEY as string);

    let result = await supabase
      .from("contests_v3")
      .select("voting_requirements, submission_requirements")
      .eq("address", address.toLowerCase())
      .eq("network_name", chainName);

    if (result.data && result.data.length > 0) {
      return NextResponse.json(result.data[0]);
    }

    result = await supabase
      .from("contests_v3")
      .select("voting_requirements, submission_requirements")
      .eq("address", address)
      .eq("network_name", chainName);

    if (result.data && result.data.length > 0) {
      return NextResponse.json(result.data[0]);
    }

    return NextResponse.json({ voting_requirements: null, submission_requirements: null });
  } catch (error: any) {
    console.error("Error processing requirements data:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
