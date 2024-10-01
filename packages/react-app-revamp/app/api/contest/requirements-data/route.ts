import { NextRequest, NextResponse } from "next/server";
import { isSupabaseConfigured } from "@helpers/database";

export async function GET(request: NextRequest) {
  if (!isSupabaseConfigured) {
    return NextResponse.json({ error: "Supabase is not configured" }, { status: 500 });
  }

  const searchParams = request.nextUrl.searchParams;
  const address = searchParams.get("address");
  const chainName = searchParams.get("chainName");

  if (!address || !chainName) {
    return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
  }

  try {
    const config = await import("@config/supabase");
    const supabase = config.supabase;

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
