import { createSupabaseClient } from "@config/supabase";
import { isSupabaseConfigured } from "@helpers/database";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

type ChargeDetails = {
  minCostToPropose: number;
  minCostToVote: number;
  isError: boolean;
};

const defaultChargeDetails: ChargeDetails = {
  minCostToPropose: 0,
  minCostToVote: 0,
  isError: false,
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const chainName = searchParams.get("chainName");

  if (!isSupabaseConfigured(SUPABASE_URL, SUPABASE_ANON_KEY) || !chainName) {
    return NextResponse.json({ ...defaultChargeDetails, isError: true });
  }

  const supabase = createSupabaseClient(SUPABASE_URL as string, SUPABASE_ANON_KEY as string);

  try {
    const { data, error } = await supabase
      .from("chain_params")
      .select("min_cost_to_propose, min_cost_to_vote")
      .eq("network_name", chainName.toLowerCase())
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("Error fetching entry charge details:", error.message);
      return NextResponse.json({ ...defaultChargeDetails, isError: true });
    }

    return NextResponse.json({
      minCostToPropose: data ? data.min_cost_to_propose : 0,
      minCostToVote: data ? data.min_cost_to_vote : 0,
      isError: false,
    });
  } catch (error: any) {
    console.error("Unexpected error fetching entry charge details:", error.message);
    return NextResponse.json({ ...defaultChargeDetails, isError: true });
  }
}
