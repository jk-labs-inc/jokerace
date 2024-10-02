"use client";
import ListContests from "@components/_pages/ListContests";
import { useQuery } from "@tanstack/react-query";
import { getPastContests, getRewards, ITEMS_PER_PAGE } from "lib/contests";
import { useState } from "react";
import { useAccount } from "wagmi";

function useContests() {
  const [page, setPage] = useState(0);
  const { address } = useAccount();

  const {
    status,
    data: contestData,
    error,
    isFetching: isContestDataFetching,
  } = useQuery({
    queryKey: ["pastContests", page, address],
    queryFn: () => getPastContests(page, ITEMS_PER_PAGE, address),
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
const PastContests = () => {
  const { page, setPage, status, contestData, rewardsData, error, isContestDataFetching, isRewardsFetching } =
    useContests();

  return (
    <div className="container mx-auto pt-10">
      <h1 className="sr-only">Past contests</h1>
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
      />
    </div>
  );
};

export default PastContests;
