import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@helpers/database";

export interface ExtensionSupabase {
  name: string;
}

export async function GET() {
  if (!isSupabaseConfigured) {
    return NextResponse.json({ error: "Supabase is not configured" }, { status: 500 });
  }

  try {
    const config = await import("@config/supabase");
    const supabase = config.supabase;

    const { data, error } = await supabase.from("extensions").select("name").eq("enabled", true);

    if (error) {
      throw new Error(`Error in fetchExtensions: ${error.message}`);
    }

    return NextResponse.json(data || []);
  } catch (e) {
    console.error("Error fetching extensions:", e);
    return NextResponse.json({ error: "Failed to fetch extensions" }, { status: 500 });
  }
}
