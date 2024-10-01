import { NextRequest, NextResponse } from "next/server";
import { isSupabaseConfigured } from "@helpers/database";

export async function GET(request: NextRequest) {
  if (!isSupabaseConfigured) {
    return NextResponse.json({ error: "Supabase is not configured" }, { status: 500 });
  }

  const searchParams = request.nextUrl.searchParams;
  const contestAddresses = searchParams.get("addresses");

  if (!contestAddresses) {
    return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
  }

  try {
    const addresses = contestAddresses.split(",");

    const config = await import("@config/supabase");
    const supabase = config.supabase;

    const result = await supabase.from("contests_v3").select("title, address").in("address", addresses);

    const { data, error } = result;
    if (error) {
      throw error;
    }

    return NextResponse.json({ data });
  } catch (error: any) {
    console.error("Error fetching contest details:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
