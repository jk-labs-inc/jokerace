import { NextRequest, NextResponse } from "next/server";
import { isSupabaseConfigured } from "@helpers/database";

export async function GET(request: NextRequest) {
  if (!isSupabaseConfigured) {
    return NextResponse.json({ message: "Supabase is not configured" }, { status: 500 });
  }

  const searchParams = request.nextUrl.searchParams;
  const contestAddress = searchParams.get("contestAddress");
  const userAddress = searchParams.get("userAddress");
  const networkName = searchParams.get("networkName");

  if (!contestAddress || !userAddress || !networkName) {
    return NextResponse.json({ message: "Missing required parameters" }, { status: 400 });
  }

  try {
    const config = await import("@config/supabase");
    const supabase = config.supabase;

    const { data, error } = await supabase
      .from("contest_participants_v3")
      .select("can_submit, num_votes")
      .eq("user_address", userAddress)
      .eq("contest_address", contestAddress)
      .eq("network_name", networkName);

    if (error) throw error;

    if (data && data.length > 0) {
      return NextResponse.json(data[0]);
    } else {
      return NextResponse.json(null);
    }
  } catch (e) {
    console.error(e);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
