import { SortOption } from "@components/Sort";

type ContestType = "liveContests" | "upcomingContests";

const sortOptionsMapping: Record<ContestType, SortOption[]> = {
  liveContests: [
    { property: "newest", label: "Newest" },
    { property: "oldest", label: "Oldest" },
    { property: "closest_deadline", label: "Closest Deadline" },
    { property: "submissions_open", label: "Submissions Open" },
    { property: "voting_open", label: "Voting Open" },
  ],
  upcomingContests: [
    { property: "newest", label: "Newest" },
    { property: "oldest", label: "Oldest" },
  ],
};

const useContestSortOptions = (contestType: ContestType): SortOption[] => {
  return sortOptionsMapping[contestType] || [];
};

export default useContestSortOptions;
