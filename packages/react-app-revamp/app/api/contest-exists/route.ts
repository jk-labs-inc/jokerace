import { NextRequest, NextResponse } from "next/server";
import { isSupabaseConfigured } from "@helpers/database";

export async function GET(request: NextRequest) {
  if (!isSupabaseConfigured) {
    return NextResponse.json({ exists: false }, { status: 500 });
  }

  const searchParams = request.nextUrl.searchParams;
  const address = searchParams.get("address");
  const networkName = searchParams.get("networkName");

  if (!address || !networkName) {
    return NextResponse.json({ exists: false }, { status: 400 });
  }

  const config = await import("@config/supabase");
  const supabase = config.supabase;

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
