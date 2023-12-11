export function sortContests(query: any, sortBy: string) {
  switch (sortBy) {
    case "newest":
      return query.order("created_at", { ascending: false });
    case "oldest":
      return query.order("created_at", { ascending: true });
    case "closest_deadline":
      return query.order("end_at", { ascending: true });
    case "submissions_open":
      return query.gte("start_at", new Date().toISOString()).lt("vote_start_at", new Date().toISOString());
    case "voting_open":
      return query.gte("vote_start_at", new Date().toISOString()).lte("end_at", new Date().toISOString());
    default:
      return query;
  }
}
