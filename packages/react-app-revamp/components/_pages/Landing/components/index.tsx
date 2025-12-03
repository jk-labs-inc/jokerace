import FeaturedContests from "@components/_pages/FeaturedContests";
import CustomLink from "@components/UI/Link";
import TypewriterCycler from "@components/UI/TypewriterCycler";
import { ROUTE_CREATE_CONTEST, ROUTE_VIEW_LIVE_CONTESTS } from "@config/routes";
import { isSupabaseConfigured } from "@helpers/database";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { useQuery } from "@tanstack/react-query";
import { streamFeaturedContests } from "lib/contests";
import { CONTESTS_FEATURE_COUNT } from "lib/contests/constants";
import { fetchTotalRewardsForContests } from "lib/contests/contracts";
import { ProcessedContest } from "lib/contests/types";
import moment from "moment";
import { useState } from "react";
import { useMediaQuery } from "react-responsive";
import LandingPageExplainer from "./Explainer";
import LandingPageUsedBy from "./UsedBy";

const wordConfig = {
  desktop: [
    "hackathons",
    "grants rounds",
    "awards",
    "applications",
    "demo days",
    "talent communities",
    "art contests",
    "debates",
    "reality tv shows",
  ],
  mobile: [
    "hackathons",
    "grants",
    "awards",
    "applications",
    "demo days",
    "leaderboards",
    "art contests",
    "debates",
    "game shows",
  ],
};

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
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const words = isMobile ? wordConfig.mobile : wordConfig.desktop;
  const { status, contestData, rewardsData, isRewardsFetching, isContestDataFetching } = useFeaturedContests();

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-8 pl-4 pr-4 md:pl-16 md:pr-16 lg:mt-6 3xl:pl-28 2xl:pr-0 ">
        <div className="flex flex-col">
          <p className="text-[28px] md:text-[48px] font-bold">
            contests for{" "}
            <span className="text-transparent bg-clip-text bg-gradient-purple inline-block">
              <TypewriterCycler words={words} delayBetweenWords={1} />
            </span>
          </p>
          <p className="text-[16px] md:text-[24px] font-bold">for communities to grow, run, and monetize</p>
        </div>
      </div>
      <div className="flex flex-col gap-8 bg-gradient-fade-black-purple">
        <div className="pl-4 pr-4 md:pl-16 md:pr-16 3xl:pl-28 2xl:pr-0 ">
          <CustomLink
            to={ROUTE_CREATE_CONTEST}
            className="bg-gradient-green w-[300px] md:w-[320px] h-10 md:h-12 rounded-[40px] text-[20px] font-bold text-true-black text-center flex items-center justify-center transition-all duration-300 hover:opacity-90"
          >
            <span className="flex items-center normal-case">
              create a contest in seconds
              <ChevronRightIcon className="w-6 h-6 ml-2 text-true-black font-bold" />
            </span>
          </CustomLink>
        </div>

        <div className="pl-4 pr-4 md:pl-16 md:pr-16 3xl:pl-28 2xl:pr-0 mt-4">
          {isSupabaseConfigured ? (
            <div className="flex flex-col gap-8 w-full">
              <FeaturedContests
                status={status}
                contestData={contestData}
                rewardsData={rewardsData}
                isContestDataFetching={isContestDataFetching}
                isRewardsFetching={isRewardsFetching}
              />
              <CustomLink to={ROUTE_VIEW_LIVE_CONTESTS} className="flex gap-1 items-center">
                <p className="text-[16px] md:text-[18px] text-positive-11 font-bold hover:text-positive-10 transition-colors duration-300 ease-in-out">
                  view all contests
                </p>
                <ChevronRightIcon className="w-4 h-4 text-positive-11 font-bold" />
              </CustomLink>
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
