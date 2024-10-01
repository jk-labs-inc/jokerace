import { createSupabaseClient } from "@config/supabase";
import { isSupabaseConfigured } from "@helpers/database";
import { NextResponse } from "next/server";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

export interface ExtensionSupabase {
  name: string;
}

export async function GET() {
  if (!isSupabaseConfigured(SUPABASE_URL, SUPABASE_ANON_KEY)) {
    return NextResponse.json({ error: "Supabase is not configured" }, { status: 500 });
  }

  try {
    const supabase = createSupabaseClient(SUPABASE_URL as string, SUPABASE_ANON_KEY as string);

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
