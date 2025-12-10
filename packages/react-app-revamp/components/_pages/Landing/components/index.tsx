"use client";

import FeaturedContests from "@components/_pages/FeaturedContests";
import CustomLink from "@components/UI/Link";
import { ROUTE_VIEW_LIVE_CONTESTS } from "@config/routes";
import { isSupabaseConfigured } from "@helpers/database";
import { useQuery } from "@tanstack/react-query";
import { streamFeaturedContests } from "lib/contests";
import { CONTESTS_FEATURE_COUNT } from "lib/contests/constants";
import { fetchTotalRewardsForContests } from "lib/contests/contracts";
import { ProcessedContest } from "lib/contests/types";
import moment from "moment";
import { motion } from "motion/react";
import { useState } from "react";
import LandingPageExplainer from "./Explainer";
import LandingPageUsedBy from "./UsedBy";

function useFeaturedContests() {
  const [page] = useState(0);
  const [contests, setContests] = useState<ProcessedContest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isStreamingComplete, setIsStreamingComplete] = useState(false);
  const [status, setStatus] = useState<"error" | "pending" | "success">("pending");

  useQuery({
    queryKey: ["featuredContestsStream", page],
    queryFn: async () => {
      setIsLoading(true);
      setStatus("pending");
      setContests([]);
      setIsStreamingComplete(false);

      try {
        const tempContests: ProcessedContest[] = [];

        for await (const contest of streamFeaturedContests(page, CONTESTS_FEATURE_COUNT)) {
          if (contest) {
            tempContests.push(contest);
            setContests(prev => [...prev, contest]);
            setStatus("success");
          }
        }

        // Sort once all contests are loaded
        const now = moment();
        const sortedContests = tempContests.sort((a, b) => {
          const aIsHappening = moment(a.created_at).isBefore(now) && moment(a.end_at).isAfter(now);
          const bIsHappening = moment(b.created_at).isBefore(now) && moment(b.end_at).isAfter(now);

          if (aIsHappening && bIsHappening) {
            return moment(a.end_at).diff(now) - moment(b.end_at).diff(now);
          }

          if (aIsHappening) return -1;
          if (bIsHappening) return 1;

          return moment(a.created_at).diff(now) - moment(b.created_at).diff(now);
        });

        setContests(sortedContests);
        setIsStreamingComplete(true);
        setIsLoading(false);
        return true;
      } catch (e) {
        console.error("Error fetching featured contests:", e);
        setStatus("error");
        setIsLoading(false);
        setIsStreamingComplete(true);
        return false;
      }
    },
    refetchOnWindowFocus: false,
  });

  const { data: rewardsData, isFetching: isRewardsFetching } = useQuery({
    queryKey: ["totalRewards", isStreamingComplete ? contests.length : "pending"],
    queryFn: () => fetchTotalRewardsForContests(contests),
    enabled: isStreamingComplete && contests.length > 0,
    refetchOnWindowFocus: false,
  });

  return {
    status,
    contestData: contests,
    rewardsData: rewardsData,
    isRewardsFetching: isRewardsFetching,
    isContestDataFetching: isLoading,
  };
}

const LandingPage = () => {
  const { status, contestData, rewardsData, isRewardsFetching, isContestDataFetching } = useFeaturedContests();

  return (
    <div className="flex flex-col gap-8 pb-6">
      <div className="flex flex-col gap-8">
        <div className="pl-4 pr-4 md:pl-16 md:pr-16 3xl:pl-20 2xl:pr-0 mt-6 lx:mt-12">
          {isSupabaseConfigured ? (
            <div className="flex flex-col gap-8 w-full lx:w-fit">
              <FeaturedContests
                status={status}
                contestData={contestData}
                rewardsData={rewardsData}
                isContestDataFetching={isContestDataFetching}
                isRewardsFetching={isRewardsFetching}
              />
              <motion.div className="ml-auto" whileTap={{ scale: 0.97 }} style={{ willChange: "transform" }}>
                <CustomLink
                  prefetch={true}
                  href={ROUTE_VIEW_LIVE_CONTESTS}
                  className="bg-positive-18 text-base 2xl:text-2xl text-true-black font-bold px-4 h-10 flex items-center justify-center rounded-2xl"
                >
                  view all contests
                </CustomLink>
              </motion.div>
            </div>
          ) : (
            <div className="border-neutral-4 animate-appear p-3 rounded-md border-solid border mb-5 text-sm font-bold">
              This site&apos;s current deployment does not have access to jokerace&apos;s reference database of
              contests, but you can check out our Supabase backups{" "}
              <a
                className="link px-1ex"
                href="https://github.com/jk-labs-inc/jokerace/tree/staging/packages/supabase"
                target="_blank"
                rel="noreferrer"
              >
                here
              </a>{" "}
              for contest chain and address information!
            </div>
          )}
        </div>
      </div>
      <LandingPageUsedBy />
      <LandingPageExplainer />
    </div>
  );
};

export default LandingPage;
