import { NextRequest, NextResponse } from "next/server";
import { isSupabaseConfigured } from "@helpers/database";

export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured) {
    return NextResponse.json({ error: "Supabase is not configured" }, { status: 500 });
  }

  try {
    const { email_address, user_address } = await request.json();

    if (!email_address) {
      return NextResponse.json({ error: "Email address is required" }, { status: 400 });
    }

    const config = await import("@config/supabase");
    const supabase = config.supabase;

    const { error } = await supabase.from("email_signups").insert([{ email_address, user_address }]);

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error subscribing user:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
