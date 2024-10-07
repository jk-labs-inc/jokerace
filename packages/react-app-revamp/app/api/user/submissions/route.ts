import { createSupabaseClient } from "@config/supabase";
import { isSupabaseConfigured } from "@helpers/database";
import { NextRequest, NextResponse } from "next/server";
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

export const fetchCache = "force-no-store";

export async function GET(request: NextRequest) {
  if (!isSupabaseConfigured(SUPABASE_URL as string, SUPABASE_ANON_KEY as string)) {
    return NextResponse.json({ error: "Supabase is not configured" }, { status: 500 });
  }

  const searchParams = request.nextUrl.searchParams;
  const userAddress = searchParams.get("userAddress");
  const from = parseInt(searchParams.get("from") || "0", 10);
  const to = parseInt(searchParams.get("to") || "9", 10);
  const voteAmount = searchParams.get("voteAmount");

  if (!userAddress) {
    return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
  }

  try {
    const supabase = createSupabaseClient(SUPABASE_URL as string, SUPABASE_ANON_KEY as string);

    const executeQuery = async (useIlike: boolean) => {
      let dataQuery;
      let countQuery;

      const baseQuery = (query: any) => {
        if (useIlike) {
          return query.ilike("user_address", userAddress);
        } else {
          return query.eq("user_address", userAddress);
        }
      };

      if (voteAmount === "null") {
        dataQuery = baseQuery(
          supabase
            .from("analytics_contest_participants_v3")
            .select("network_name, contest_address, proposal_id, created_at"),
        )
          .is("vote_amount", null)
          .is("comment_id", null)
          .order("created_at", { ascending: false })
          .range(from, to);

        countQuery = baseQuery(
          supabase.from("analytics_contest_participants_v3").select("*", { count: "exact", head: true }),
        )
          .is("vote_amount", null)
          .is("comment_id", null);
      } else {
        dataQuery = baseQuery(
          supabase
            .from("analytics_contest_participants_v3")
            .select("network_name, contest_address, proposal_id, created_at, vote_amount"),
        )
          .not("vote_amount", "is", null)
          .order("created_at", { ascending: false })
          .range(from, to);

        countQuery = baseQuery(
          supabase.from("analytics_contest_participants_v3").select("*", { count: "exact", head: true }),
        ).not("vote_amount", "is", null);
      }

      const [dataResult, countResult] = await Promise.all([dataQuery, countQuery]);

      return { dataResult, countResult };
    };

    // first attempt with eq
    let { dataResult, countResult } = await executeQuery(false);

    // if no results, it could be that address is lowercase, try with ilike
    if (dataResult.data?.length === 0) {
      ({ dataResult, countResult } = await executeQuery(true));
    }

    if (dataResult.error) throw dataResult.error;
    if (countResult.error) throw countResult.error;

    const data = dataResult.data || [];
    const count = countResult.count ?? 0;

    return NextResponse.json({ data, count });
  } catch (error: any) {
    console.error("Error fetching submissions:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
