import { createSupabaseClient } from "@config/supabase";
import { isSupabaseConfigured } from "@helpers/database";
import { NextRequest, NextResponse } from "next/server";

export const fetchCache = "force-no-store";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

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

  if (!isSupabaseConfigured(SUPABASE_URL, SUPABASE_ANON_KEY)) {
    return NextResponse.json({ error: "Supabase is not configured" }, { status: 500 });
  }

  try {
    const supabase = createSupabaseClient(SUPABASE_URL as string, SUPABASE_ANON_KEY as string);

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
