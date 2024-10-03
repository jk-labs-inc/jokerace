"use client";
import ListContests from "@components/_pages/ListContests";
import useContestSortOptions from "@hooks/useSortOptions";
import { useQuery } from "@tanstack/react-query";
import { getRewards, getUpcomingContests, ITEMS_PER_PAGE } from "lib/contests";
import { useState } from "react";
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
    queryKey: ["upcomingContests", page, address, sortBy],
    queryFn: () => getUpcomingContests(page, ITEMS_PER_PAGE, address, sortBy),
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
    error,
    isContestDataFetching,
    isRewardsFetching,
  };
}

const UpcomingContests = () => {
  const [sortBy, setSortBy] = useState<string>("");
  const sortOptions = useContestSortOptions("upcomingContests");
  const { page, setPage, status, contestData, rewardsData, error, isContestDataFetching, isRewardsFetching } =
    useContests(sortBy);

  return (
    <div className="container mx-auto pt-10">
      <h1 className="sr-only">Upcoming contests</h1>
      <ListContests
        isContestDataFetching={isContestDataFetching}
        isRewardsFetching={isRewardsFetching}
        itemsPerPage={ITEMS_PER_PAGE}
        status={status}
        error={error}
        page={page}
        setPage={setPage}
        contestData={contestData}
        rewardsData={rewardsData}
        sortOptions={sortOptions}
        onSortChange={setSortBy}
      />
    </div>
  );
};

export default UpcomingContests;
