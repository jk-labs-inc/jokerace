import { NextRequest, NextResponse } from "next/server";
import { isSupabaseConfigured } from "@helpers/database";
import { chains } from "@config/wagmi";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const chainName = searchParams.get("chainName");
  const costToPropose = searchParams.get("costToPropose");
  const costToVote = searchParams.get("costToVote");

  if (!chainName || !costToPropose || !costToVote) {
    return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
  }

  // check if either costToPropose or costToVote is 0 ( this means no monetization )
  if (parseFloat(costToPropose) === 0 || parseFloat(costToVote) === 0) {
    return NextResponse.json({ address: "" });
  }

  if (!isSupabaseConfigured) {
    return NextResponse.json({ error: "Supabase is not configured" }, { status: 500 });
  }

  try {
    const config = await import("@config/supabase");
    const supabase = config.supabase;

    const { data, error } = await supabase
      .from("chain_params")
      .select("jk_labs_split_destination")
      .eq("network_name", chainName)
      .single();

    if (error) {
      throw new Error(`Error fetching data: ${error.message}`);
    }

    if (!data) {
      return NextResponse.json({ error: `No data found for chain ${chainName}` }, { status: 404 });
    }

    return NextResponse.json({ address: data.jk_labs_split_destination });
  } catch (error: any) {
    console.error("Error fetching JKLabs split destination address:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
