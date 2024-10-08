import { createSupabaseClient } from "@config/supabase";
import { isSupabaseConfigured } from "@helpers/database";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

export async function GET(request: NextRequest) {
  if (!isSupabaseConfigured(SUPABASE_URL, SUPABASE_ANON_KEY)) {
    return NextResponse.json({ exists: false }, { status: 500 });
  }

  const searchParams = request.nextUrl.searchParams;
  const address = searchParams.get("address");
  const networkName = searchParams.get("networkName");

  if (!address || !networkName) {
    return NextResponse.json({ exists: false }, { status: 400 });
  }

  const supabase = createSupabaseClient(SUPABASE_URL as string, SUPABASE_ANON_KEY as string);

  try {
    let { data, error } = await supabase
      .from("contests_v3")
      .select("address")
      .eq("address", address.toLowerCase())
      .eq("network_name", networkName);

    if (error) {
      throw new Error(error.message);
    }

    if (data && data.length > 0) {
      return NextResponse.json({ exists: true });
    }

    ({ data, error } = await supabase
      .from("contests_v3")
      .select("address")
      .eq("address", address)
      .eq("network_name", networkName));

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({ exists: data ? data.length > 0 : false });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ exists: false }, { status: 500 });
  }
}
