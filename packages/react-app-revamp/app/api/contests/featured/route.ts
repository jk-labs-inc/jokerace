import { createSupabaseClient } from "@config/supabase";
import { isSupabaseConfigured } from "@helpers/database";
import getPagination from "@helpers/getPagination";
import moment from "moment";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

export async function GET(request: NextRequest) {
  if (!isSupabaseConfigured(SUPABASE_URL, SUPABASE_ANON_KEY)) {
    return NextResponse.json({ message: "Supabase is not configured" }, { status: 500 });
  }

  const searchParams = request.nextUrl.searchParams;
  const currentPage = parseInt(searchParams.get("currentPage") || "1", 10);
  const itemsPerPage = parseInt(searchParams.get("itemsPerPage") || "10", 10);

  const supabase = createSupabaseClient(SUPABASE_URL as string, SUPABASE_ANON_KEY as string);
  const { from, to } = getPagination(currentPage, itemsPerPage);

  try {
    const { data, count, error } = await supabase
      .from("contests_v3")
      .select(
        "created_at, start_at, end_at, address, author_address, network_name, vote_start_at, featured, title, type, summary, prompt, submissionMerkleRoot, votingMerkleRoot, voting_requirements, submission_requirements",
        { count: "exact" },
      )
      .is("featured", true)
      .range(from, to);

    if (error) throw new Error(error.message);

    // sort the data
    data.sort((a, b) => {
      const now = moment();
      const aIsHappening = moment(a.created_at).isBefore(now) && moment(a.end_at).isAfter(now);
      const bIsHappening = moment(b.created_at).isBefore(now) && moment(b.end_at).isAfter(now);

      // both are happening, sort by nearest end date
      if (aIsHappening && bIsHappening) {
        return moment(a.end_at).diff(now) - moment(b.end_at).diff(now);
      }

      // only one is happening, it comes first
      if (aIsHappening) return -1;
      if (bIsHappening) return 1;

      // none are happening, sort by nearest start date
      return moment(a.created_at).diff(now) - moment(b.created_at).diff(now);
    });

    return NextResponse.json({ data, count });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
