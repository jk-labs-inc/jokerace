import { createSupabaseClient } from "@config/supabase";
import { isSupabaseConfigured } from "@helpers/database";
import getPagination from "@helpers/getPagination";
import { sortContests } from "lib/contests/utils/sortContests";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

const ITEMS_PER_PAGE = 7;

export async function GET(request: NextRequest) {
  if (!isSupabaseConfigured(SUPABASE_URL, SUPABASE_ANON_KEY)) {
    return NextResponse.json({ message: "Supabase is not configured" }, { status: 500 });
  }

  const searchParams = request.nextUrl.searchParams;
  const searchColumn = searchParams.get("searchColumn") || "title";
  const searchString = searchParams.get("searchString") || "";
  const currentPage = parseInt(searchParams.get("currentPage") || "1", 10);
  const itemsPerPage = parseInt(searchParams.get("itemsPerPage") || String(ITEMS_PER_PAGE), 10);
  const orderBy = searchParams.get("orderBy") || "created_at";
  const ascending = searchParams.get("ascending") === "true";
  const table = searchParams.get("table") || "contests_v3";
  const language = searchParams.get("language") || "english";
  const sortBy = searchParams.get("sortBy") || "";

  const supabase = createSupabaseClient(SUPABASE_URL as string, SUPABASE_ANON_KEY as string);
  const { from, to } = getPagination(currentPage, itemsPerPage);

  try {
    let query = supabase
      .from(table)
      .select(
        "created_at, start_at, end_at, address, author_address, network_name, vote_start_at, featured, title, type, summary, prompt, submissionMerkleRoot, votingMerkleRoot, voting_requirements, submission_requirements",
        { count: "exact" },
      )
      .textSearch(searchColumn, `${searchString}`, {
        type: "websearch",
        config: language,
      })
      .eq("hidden", false);

    if (sortBy) {
      query = sortContests(query, sortBy);
    }

    query = query.range(from, to).order(orderBy, { ascending });

    const { data, count, error } = await query;

    if (error) throw new Error(error.message);

    return NextResponse.json({ data, count });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
