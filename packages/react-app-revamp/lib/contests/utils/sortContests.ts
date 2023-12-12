export function sortContests(query: any, sortBy: string) {
  const currentTime = new Date().toISOString();

  switch (sortBy) {
    case "newest":
      return query.order("created_at", { ascending: false });
    case "oldest":
      return query.order("created_at", { ascending: true });
    case "closest_deadline":
      return query.order("end_at", { ascending: true });
    case "submissions_open":
      return query.lte("start_at", currentTime).gt("vote_start_at", currentTime);
    case "voting_open":
      return query.lte("vote_start_at", currentTime).gte("end_at", currentTime);
    default:
      return query;
  }
}
