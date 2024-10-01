import { NextRequest, NextResponse } from "next/server";
import { isSupabaseConfigured } from "@helpers/database";

export async function GET(request: NextRequest) {
  if (!isSupabaseConfigured) {
    return NextResponse.json({ canUpload: false }, { status: 500 });
  }

  const searchParams = request.nextUrl.searchParams;
  const userAddress = searchParams.get("userAddress");
  const requiredSize = searchParams.get("requiredSize");

  if (!userAddress || !requiredSize) {
    return NextResponse.json({ canUpload: false }, { status: 400 });
  }

  try {
    const config = await import("@config/supabase");
    const supabase = config.supabase;
    const { data, error } = await supabase
      .from("user_permissions")
      .select("allowlist_max_size")
      .eq("user_address", userAddress);

    if (error || !data[0]) {
      return NextResponse.json({ canUpload: false });
    }

    const canUpload = data[0].allowlist_max_size >= parseInt(requiredSize, 10);
    return NextResponse.json({ canUpload });
  } catch (error) {
    console.error("Error checking allowlist permission:", error);
    return NextResponse.json({ canUpload: false }, { status: 500 });
  }
}
