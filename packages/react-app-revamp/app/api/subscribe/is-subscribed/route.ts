import { createSupabaseClient } from "@config/supabase";
import { isSupabaseConfigured } from "@helpers/database";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

export async function GET(request: NextRequest) {
  if (!isSupabaseConfigured(SUPABASE_URL, SUPABASE_ANON_KEY)) {
    return NextResponse.json({ error: "Supabase is not configured" }, { status: 500 });
  }

  const searchParams = request.nextUrl.searchParams;
  const emailAddress = searchParams.get("emailAddress");

  if (!emailAddress) {
    return NextResponse.json({ error: "Email address is required" }, { status: 400 });
  }

  try {
    const supabase = createSupabaseClient(SUPABASE_URL as string, SUPABASE_ANON_KEY as string);

    const { data, error } = await supabase
      .from("email_signups")
      .select("email_address")
      .eq("email_address", emailAddress);

    if (error) {
      throw error;
    }

    return NextResponse.json({ exists: data.length > 0 });
  } catch (error: any) {
    console.error("Error checking email existence:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
