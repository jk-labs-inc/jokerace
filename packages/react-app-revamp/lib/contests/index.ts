import getPagination from "@helpers/getPagination";

export const ITEMS_PER_PAGE = 7;

export async function getContestByTitle(title: string, currentPage: number, itemsPerPage: number) {
  if (
    process.env.NEXT_PUBLIC_SUPABASE_URL !== "" &&
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== "" &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    const config = await import("@config/supabase");
    const supabase = config.supabase;
    const { from, to } = getPagination(currentPage, itemsPerPage);
    try {
      const result = await supabase
        .from("contests")
        .select("*", { count: "exact" })
        // search for contests whose title matches the input title
        .textSearch("title", `${title}`, {
          type: "websearch",
          config: "english",
        })
        .range(from, to)
        .order("created_at", { ascending: false }); // order by created_at in descending order

      const { data, count, error } = result;
      if (error) {
        throw new Error(error.message);
      }
      return { data, count };
    } catch (e) {
      console.error(e);
    }
  }
}

export async function getLiveContests(currentPage: number, itemsPerPage: number) {
  if (
    process.env.NEXT_PUBLIC_SUPABASE_URL !== "" &&
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== "" &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    const config = await import("@config/supabase");
    const supabase = config.supabase;
    const { from, to } = getPagination(currentPage, itemsPerPage);
    try {
      const result = await supabase
        .from("contests")
        .select("*", { count: "exact" })
        // all rows whose submission start date is <= to the current date.
        .lte("start_at", new Date().toISOString())
        // all rows whose votes end date is >= to the current date.
        .gte("end_at", new Date().toISOString())
        .order("end_at", { ascending: true })
        .range(from, to);
      const { data, count, error } = result;
      if (error) {
        throw new Error(error.message);
      }
      return { data, count };
    } catch (e) {
      console.error(e);
    }
  }
}

export async function getPastContests(currentPage: number, itemsPerPage: number) {
  if (
    process.env.NEXT_PUBLIC_SUPABASE_URL !== "" &&
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== "" &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    const config = await import("@config/supabase");
    const supabase = config.supabase;
    const { from, to } = getPagination(currentPage, itemsPerPage);
    try {
      const result = await supabase
        .from("contests")
        .select("*", { count: "exact" })
        // all rows whose votes end date is < to the current date.
        .lt("end_at", new Date().toISOString())
        .order("end_at", { ascending: false })
        .range(from, to);
      const { data, count, error } = result;
      if (error) {
        throw new Error(error.message);
      }
      return { data, count };
    } catch (e) {
      console.error(e);
    }
  }
}

export async function getUpcomingContests(currentPage: number, itemsPerPage: number) {
  if (
    process.env.NEXT_PUBLIC_SUPABASE_URL !== "" &&
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== "" &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    const config = await import("@config/supabase");
    const supabase = config.supabase;
    const { from, to } = getPagination(currentPage, itemsPerPage);
    try {
      const result = await supabase
        .from("contests")
        .select("*", { count: "exact" })
        // all rows whose submissions start date is > to the current date.
        .gt("start_at", new Date().toISOString())
        .order("start_at", { ascending: false })
        .range(from, to);
      const { data, count, error } = result;
      if (error) {
        throw new Error(error.message);
      }
      return { data, count };
    } catch (e) {
      console.error(e);
    }
  }
}
