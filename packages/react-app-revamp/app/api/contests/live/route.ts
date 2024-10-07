import { createSupabaseClient } from "@config/supabase";
import { isSupabaseConfigured } from "@helpers/database";
import getPagination from "@helpers/getPagination";
import { sortContests } from "lib/contests/utils/sortContests";
import { NextRequest, NextResponse } from "next/server";

export const fetchCache = "force-no-store";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

export async function GET(request: NextRequest) {
  if (!isSupabaseConfigured(SUPABASE_URL, SUPABASE_ANON_KEY)) {
    return NextResponse.json({ message: "Supabase is not configured" }, { status: 500 });
  }

  const searchParams = request.nextUrl.searchParams;
  const currentPage = parseInt(searchParams.get("currentPage") || "1", 10);
  const itemsPerPage = parseInt(searchParams.get("itemsPerPage") || "7", 10);
  const sortBy = searchParams.get("sortBy") || "";

  const supabase = createSupabaseClient(SUPABASE_URL as string, SUPABASE_ANON_KEY as string);
  const { from, to } = getPagination(currentPage, itemsPerPage);

  try {
    let query = supabase
      .from("contests_v3")
      .select(
        "created_at, start_at, end_at, address, author_address, network_name, vote_start_at, featured, title, type, summary, prompt, submissionMerkleRoot, votingMerkleRoot, voting_requirements, submission_requirements",
        { count: "exact" },
      )
      .eq("hidden", false)
      .lte("start_at", new Date().toISOString())
      .gte("end_at", new Date().toISOString());

    if (sortBy) {
      query = sortContests(query, sortBy);
    }

    query = query.range(from, to);

    const { data, count, error } = await query;

    if (error) throw new Error(error.message);

    return NextResponse.json({ data, count });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
