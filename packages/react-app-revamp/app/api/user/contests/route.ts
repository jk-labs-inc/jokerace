import { createSupabaseClient } from "@config/supabase";
import { isSupabaseConfigured } from "@helpers/database";
import getPagination from "@helpers/getPagination";
import { sortContests } from "lib/contests/utils/sortContests";
import { NextRequest, NextResponse } from "next/server";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

export async function GET(request: NextRequest) {
  if (!isSupabaseConfigured(SUPABASE_URL as string, SUPABASE_ANON_KEY as string)) {
    return NextResponse.json({ error: "Supabase is not configured" }, { status: 500 });
  }

  const searchParams = request.nextUrl.searchParams;
  const currentPage = parseInt(searchParams.get("currentPage") || "1", 10);
  const itemsPerPage = parseInt(searchParams.get("itemsPerPage") || "10", 10);
  const profileAddress = searchParams.get("profileAddress");
  const sortBy = searchParams.get("sortBy") || undefined;

  if (!profileAddress) {
    return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
  }

  try {
    const supabase = createSupabaseClient(SUPABASE_URL as string, SUPABASE_ANON_KEY as string);
    const { from, to } = getPagination(currentPage, itemsPerPage);

    const executeQuery = async (useIlike: boolean) => {
      let query = supabase
        .from("contests_v3")
        .select(
          "created_at, start_at, end_at, address, author_address, network_name, vote_start_at, featured, title, type, summary, prompt, submissionMerkleRoot, hidden, votingMerkleRoot, voting_requirements, submission_requirements",
          { count: "exact" },
        );

      if (useIlike) {
        query = query.ilike("author_address", profileAddress);
      } else {
        query = query.eq("author_address", profileAddress);
      }
      query = query.order("created_at", { ascending: false });

      if (sortBy) {
        query = sortContests(query, sortBy);
      }
      return query.range(from, to);
    };

    // first attempt with eq
    let result = await executeQuery(false);

    // if no results, it could be that address is lowercase, try with ilike
    if (result.data?.length === 0) {
      result = await executeQuery(true);
    }

    const { data, count, error } = result;
    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({ data, count: count ?? 0 });
  } catch (error: any) {
    console.error("Error fetching user contests:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
