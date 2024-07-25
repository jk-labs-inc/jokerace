"use client";
import LandingPage from "@components/_pages/Landing/components";
import { useQuery } from "@tanstack/react-query";
import { getFeaturedContests, getRewards } from "lib/contests";
import { useState } from "react";
import { useAccount } from "wagmi";

function useFeaturedContests() {
  const [page] = useState(0);
  const { address } = useAccount();

  const {
    status,
    data: contestData,
    error,
    isFetching: isContestDataFetching,
  } = useQuery({
    queryKey: ["featuredContests", page, address],
    queryFn: () => getFeaturedContests(page, 6, address),
  });

  const { data: rewardsData, isFetching: isRewardsFetching } = useQuery({
    queryKey: ["rewards", contestData],
    queryFn: () => getRewards(contestData?.data ?? []),
    enabled: !!contestData,
  });

  return {
    status,
    contestData,
    rewardsData,
    isRewardsFetching,
    error,
    isContestDataFetching,
  };
}

const Page = () => {
  const { status, contestData, rewardsData, isRewardsFetching, isContestDataFetching } = useFeaturedContests();

  return (
    <LandingPage
      status={status}
      contestData={contestData}
      rewardsData={rewardsData}
      isRewardsFetching={isRewardsFetching}
      isContestDataFetching={isContestDataFetching}
    />
  );
};

export default Page;
