"use client";
import ListContests from "@components/_pages/ListContests";
import useContestSortOptions from "@hooks/useSortOptions";
import { useQuery } from "@tanstack/react-query";
import { ITEMS_PER_PAGE, getLiveContests, getRewards } from "lib/contests";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

function useContests(sortBy?: string) {
  const [page, setPage] = useState(0);
  const { address } = useAccount();

  const {
    status,
    data: contestData,
    error,
    isFetching: isContestDataFetching,
  } = useQuery({
    queryKey: ["liveContests", page, address, sortBy],
    queryFn: () => getLiveContests(page, ITEMS_PER_PAGE, address, sortBy),
  });

  const { data: rewardsData, isFetching: isRewardsFetching } = useQuery({
    queryKey: ["rewards", contestData],
    queryFn: () => getRewards(contestData?.data ?? []),
    enabled: !!contestData,
  });

  return {
    page,
    setPage,
    status,
    contestData,
    rewardsData,
    isRewardsFetching,
    error,
    isContestDataFetching,
  };
}

const LiveContests = () => {
  const query = useSearchParams();
  const [sortBy, setSortBy] = useState<string>("");
  const { page, setPage, status, contestData, rewardsData, isRewardsFetching, error, isContestDataFetching } =
    useContests(sortBy);
  const sortOptions = useContestSortOptions("liveContests");

  useEffect(() => {
    if (query?.has("sortBy")) {
      const sortByQuery = query.get("sortBy") ?? "";
      setSortBy(sortByQuery);
    }
  }, [query]);

  return (
    <div className="container mx-auto pt-10">
      <h1 className="sr-only">Live contests</h1>
      <ListContests
        isContestDataFetching={isContestDataFetching}
        itemsPerPage={ITEMS_PER_PAGE}
        status={status}
        error={error}
        page={page}
        setPage={setPage}
        contestData={contestData}
        rewardsData={rewardsData}
        isRewardsFetching={isRewardsFetching}
        sortOptions={sortOptions}
        onSortChange={setSortBy}
      />
    </div>
  );
};

export default LiveContests;
