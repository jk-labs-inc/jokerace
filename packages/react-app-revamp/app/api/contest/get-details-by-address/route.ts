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
  const contestAddresses = searchParams.get("addresses");

  if (!contestAddresses) {
    return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
  }

  try {
    const addresses = contestAddresses.split(",");

    const supabase = createSupabaseClient(SUPABASE_URL as string, SUPABASE_ANON_KEY as string);

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
