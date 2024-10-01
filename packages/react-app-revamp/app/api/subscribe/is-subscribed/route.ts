import { NextRequest, NextResponse } from "next/server";
import { isSupabaseConfigured } from "@helpers/database";

export async function GET(request: NextRequest) {
  if (!isSupabaseConfigured) {
    return NextResponse.json({ error: "Supabase is not configured" }, { status: 500 });
  }

  const searchParams = request.nextUrl.searchParams;
  const emailAddress = searchParams.get("emailAddress");

  if (!emailAddress) {
    return NextResponse.json({ error: "Email address is required" }, { status: 400 });
  }

  try {
    const config = await import("@config/supabase");
    const supabase = config.supabase;

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
