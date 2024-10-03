import { NextRequest, NextResponse } from "next/server";
import { isSupabaseConfigured } from "@helpers/database";
import { createSupabaseClient } from "@config/supabase";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured(SUPABASE_URL, SUPABASE_ANON_KEY)) {
    return NextResponse.json({ message: "Supabase is not configured" }, { status: 500 });
  }

  try {
    const { contestAddress, networkName, userAddress, isHidden } = await request.json();

    if (!contestAddress || !networkName || !userAddress || isHidden === undefined) {
      return NextResponse.json({ message: "Missing required parameters" }, { status: 400 });
    }

    const supabase = createSupabaseClient(SUPABASE_URL as string, SUPABASE_ANON_KEY as string);

    const { error } = await supabase
      .from("contests_v3")
      .update({ hidden: isHidden })
      .eq("network_name", networkName)
      .eq("address", contestAddress)
      .eq("author_address", userAddress);

    if (error) throw error;

    return NextResponse.json({ message: "Contest visibility updated successfully" });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
