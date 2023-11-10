import { Sorting } from "@components/Sort";
import { useMemo } from "react";

export function useSortedData(data: any, sorting: Sorting | null) {
  return useMemo(() => {
    if (!sorting || !data) return data;

    const { property, ascending } = sorting;
    const order = ascending ? "ascending" : "descending";

    return data.slice().sort((a: { [x: string]: any; rewards: any }, b: { [x: string]: any; rewards: any }) => {
      let valueA;
      let valueB;
      let reverseOrder = false;

      switch (property) {
        case "rewards":
          valueA = a.rewards ? 1 : 0;
          valueB = b.rewards ? 1 : 0;
          break;
        case "qualified":
          valueA = a.qualifiedToSubmit || a.qualifiedToVote ? 1 : 0;
          valueB = b.qualifiedToSubmit || b.qualifiedToVote ? 1 : 0;
          break;
        case "closest_deadline":
          const aTimestamps = [
            new Date(a.start_at).getTime(),
            new Date(a.vote_start_at).getTime(),
            new Date(a.end_at).getTime(),
          ].filter(timestamp => timestamp >= Date.now());
          const bTimestamps = [
            new Date(b.start_at).getTime(),
            new Date(b.vote_start_at).getTime(),
            new Date(b.end_at).getTime(),
          ].filter(timestamp => timestamp >= Date.now());

          valueA = aTimestamps.length > 0 ? Math.min(...aTimestamps) : Infinity;
          valueB = bTimestamps.length > 0 ? Math.min(...bTimestamps) : Infinity;
          reverseOrder = true;
          break;
        case "can_submit":
          valueA =
            (a.qualifiedToSubmit ? 2 : 1) *
            (new Date(a.start_at).getTime() <= Date.now() && Date.now() <= new Date(a.vote_start_at).getTime() ? 1 : 0);
          valueB =
            (b.qualifiedToSubmit ? 2 : 1) *
            (new Date(b.start_at).getTime() <= Date.now() && Date.now() <= new Date(b.vote_start_at).getTime() ? 1 : 0);
          break;
        case "can_vote":
          valueA =
            (a.qualifiedToVote ? 2 : 1) *
            (new Date(a.vote_start_at).getTime() <= Date.now() && Date.now() <= new Date(a.end_at).getTime() ? 1 : 0);
          valueB =
            (b.qualifiedToVote ? 2 : 1) *
            (new Date(b.vote_start_at).getTime() <= Date.now() && Date.now() <= new Date(b.end_at).getTime() ? 1 : 0);
          break;
        default:
          valueA = a[property];
          valueB = b[property];
      }

      if (valueA < valueB) {
        return order === "ascending" ? (reverseOrder ? 1 : -1) : reverseOrder ? -1 : 1;
      }
      if (valueA > valueB) {
        return order === "ascending" ? (reverseOrder ? -1 : 1) : reverseOrder ? 1 : -1;
      }
      return 0;
    });
  }, [data, sorting]);
}
